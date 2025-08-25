// components/CustomizeEvent.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import AdjustableParameter from './AdjustableParameter';
import FeatureInput from './FeatureInput';
import DatePickerModal from './DatePickerModal';

import { toast } from 'react-toastify';

import calculateTotalPrice from './calculateTotalPrice';
import ConfirmationModal from "../../../UserPages/ConfirmationModal";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const CustomizeEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [initialEvent, setInitialEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDateModalOpen, setDateModalOpen] = useState(false);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookingDetails, setBookingDetails] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    // console.log(event);
    

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                const response = await axiosSecure.get(`/events/${id}`);
                setEvent(response.data);
                setInitialEvent(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event data:", error);
                toast.error("Failed to load event data");
                setLoading(false);
                navigate('/events'); 
            }
        };

        fetchEventData();
    }, [id, axiosSecure, navigate]);

    const handleCheckAvailabilityClick = () => {
        if (!user) {
            toast.error("Please login to book events");
            navigate('/login');
            return;
        }
        setDateModalOpen(true);
    };

    const handleCloseDateModal = () => {
        setDateModalOpen(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleConfirmEvent = async () => {
        setDateModalOpen(false);
        
        const totalPrice = calculateTotalPrice(event, initialEvent);
        const bookingData = {
            eventId: event._id,
            date: selectedDate,
            totalPrice,
            packageName: event.package_name,
            cart_Image: event.cart_Image,
            features: event.features,
            photographyTeamSize: event.photography_team_size,
            videography: event.videography,
            durationHours: event.duration_hours,
            expectedAttendance: event.expected_attendance,
            staffTeamSize: event.staff_team_size,
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            userPhoto: user.photoURL
        };

        setBookingDetails(bookingData);
        setConfirmationModalOpen(true);
    };

    const handleCouponApply = (discount) => {
        setDiscountAmount(discount);
    };

    const handleCheckout = async (finalPrice) => {
        try {
            // First create the booking
            const bookingResponse = await axiosSecure.post('/bookings', {
                ...bookingDetails,
                discountAmount,
                finalPrice
            });

            // Then initiate payment
            const paymentResponse = await axiosSecure.get(`/bookings/${bookingResponse.data._id}/payment`);
            
            // In a real implementation, you would redirect to SSLCommerz
            // For demo purposes, we'll simulate a successful payment
            await axiosSecure.post(`/bookings/${bookingResponse.data._id}/verify`);
            
            toast.success('Payment successful! Your booking is confirmed.');
            navigate('/my-bookings');
        } catch (error) {
            console.error("Error during checkout:", error);
            toast.error("Failed to complete booking");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#179ac8] text-black">
                Loading event details...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#179ac8] text-black">
                Event not found
            </div>
        );
    }

    const addFeature = (newFeature) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            features: [...(prevEvent.features ?? []), newFeature]
        }));
    };

    const updateParameter = (parameter, increment, pricePerUnit) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            [parameter]: Math.max(1, (prevEvent[parameter] ?? 0) + increment)
        }));
    };

    const resetParameter = (parameter, defaultValue, pricePerUnit) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            [parameter]: defaultValue
        }));
    };

    return (
        <div className="flex justify-center p-6 bg-white min-h-screen">
            <div className="max-w-4xl w-full bg-blue-50 rounded-lg shadow-md">
                <img
                    className="object-cover w-full h-64 rounded-t-lg"
                    src={event.cart_Image}
                    alt={event.package_name}
                />

                <div className="p-6">
                    <div className='flex justify-between'>
                        <h1 className="text-3xl font-bold mb-4 text-black">
                            {event.package_name}
                        </h1>
                        <p className="text-xl mb-4 text-black">
                            Category: {event.category}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="text-2xl font-semibold mb-6 text-black">
                            Price: {calculateTotalPrice(event, initialEvent)?.toLocaleString()} taka
                        </p>
                        <button
                            className="bg-[#179ac8] text-white px-4 py-2 rounded hover:bg-[#1482b0] transition-colors"
                            onClick={handleCheckAvailabilityClick}
                        >
                            Check Availability
                        </button>
                    </div>
                    
                    <FeatureInput
                        features={event.features}
                        onFeatureAdd={addFeature}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <AdjustableParameter
                            parameter="photography_team_size"
                            label="Photography Team Size"
                            pricePerUnit={300}
                            unit="members"
                            defaultValue={initialEvent?.photography_team_size}
                            value={event.photography_team_size}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="duration_hours"
                            label="Duration"
                            pricePerUnit={1000}
                            unit="hours"
                            defaultValue={initialEvent?.duration_hours}
                            value={event.duration_hours}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="expected_attendance"
                            label="Expected Attendance"
                            pricePerUnit={50}
                            unit="people"
                            defaultValue={initialEvent?.expected_attendance}
                            value={event.expected_attendance}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="staff_team_size"
                            label="Staff Team Size"
                            pricePerUnit={500}
                            unit="members"
                            defaultValue={initialEvent?.staff_team_size}
                            value={event.staff_team_size}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <p className="text-black text-xl font-extrabold">
                            Videography: {event.videography ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Event Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {event.images?.map((image, index) => (
                            <img
                                key={index}
                                className="object-cover w-full h-48 rounded-lg"
                                src={image}
                                alt={`Event image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <DatePickerModal
                isOpen={isDateModalOpen}
                onClose={handleCloseDateModal}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onConfirm={handleConfirmEvent}
            />

            {bookingDetails && (
                <ConfirmationModal
                    isOpen={isConfirmationModalOpen}
                    onClose={() => setConfirmationModalOpen(false)}
                    bookingDetails={bookingDetails}
                    onCouponApply={handleCouponApply}
                    onCheckout={handleCheckout}
                />
            )}
        </div>
    );
};

export default CustomizeEvent;