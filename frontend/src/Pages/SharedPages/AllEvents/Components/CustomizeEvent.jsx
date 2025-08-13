import { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import AdjustableParameter from './AdjustableParameter';
import FeatureInput from './FeatureInput';
import DatePickerModal from './DatePickerModal';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import calculateTotalPrice from './calculateTotalPrice';

const CustomizeEvent = () => {
    const initialEvent = useLoaderData();

    
    const [event, setEvent] = useState(initialEvent);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log('New Events',initialEvent,event);
    

    console.log(initialEvent);
    


    const handleCheckAvailabilityClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };



    const addFeature = (newFeature) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            features: [...(prevEvent.features ?? []), newFeature],
            price: (prevEvent.price ?? 0) + 500 // Increase price by 500 taka
        }));
    };

    const updateParameter = (parameter, increment, pricePerUnit) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            [parameter]: Math.max(1, (prevEvent[parameter] ?? 0) + increment),
            price: (prevEvent.price ?? 0) + (pricePerUnit * increment)
        }));
    };

    const resetParameter = (parameter, defaultValue, pricePerUnit) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            [parameter]: defaultValue,
            price: (prevEvent.price ?? 0) - (pricePerUnit * ((prevEvent[parameter] ?? 0) - defaultValue))
        }));
    };
    const date = selectedDate
    const confirmDate = {
        category: event.category,
        totalPrice: calculateTotalPrice(event, initialEvent),
        package_name: event.package_name,
        carrt_Image: event.carrt_Image,
        // price: event.price,
        features: event.features,
        images: event.images,
        photography_team_size: event.photography_team_size,
        videography: event.videography,
        duration_hours: event.duration_hours,
        expected_attendance: event.expected_attendance,
        staff_team_size: event.staff_team_size,
        date: date,
        payment: 'Pending',
        // totalPrice: event.price,
        email: user.email,
        user_Name: user.displayName,
        user_Photo: user.photoURL,
        event_organizer: "",
        moderator: ""
    }
    // console.log(confirmDate);
    const handleConfirmDate = () => {
        console.log(confirmDate);
        
        axiosSecure.post('/confirmEvents', confirmDate)

            .then(res => {
                if (res.data.insertedId) {
                    toast.success('Event Added To Cart Successfully', {
                        autoClose: 5000,
                    });
                    navigate('/dashboard/user/booked-events')
                    console.log(res);
                    handleCloseModal();
                }
            })
            .catch(error => {
                toast.error(error.message)
                console.log(error);

            })

    };

    return (
        <div className="flex justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-md dark:bg-gray-800">
                <img
                    className="object-cover w-full h-64 rounded-t-lg"
                    src={event?.carrt_Image}
                    alt={event?.package_name}
                />

                <div className="p-6">
                    <div className='flex justify-between'>
                        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{event?.package_name}</h1>
                        <p className="text-xl mb-4 text-gray-600 dark:text-gray-300">Category: {event?.category}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Price: {event?.price?.toLocaleString()} taka</p>
                        <button
                            className="bg-blue-600 text-white btn rounded hover:bg-blue-700"
                            onClick={handleCheckAvailabilityClick}
                        >
                            Check Availability
                        </button>
                    </div>
                    
                    <FeatureInput
                        features={event?.features}
                        onFeatureAdd={addFeature}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <AdjustableParameter
                            parameter="photography_team_size"
                            label="Photography Team Size"
                            pricePerUnit={300}
                            unit="members"
                            defaultValue={initialEvent?.photography_team_size}
                            value={event?.photography_team_size}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="duration_hours"
                            label="Duration"
                            pricePerUnit={1000}
                            unit="hours"
                            defaultValue={initialEvent?.duration_hours}
                            value={event?.duration_hours}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="expected_attendance"
                            label="Expected Attendance"
                            pricePerUnit={50}
                            unit="people"
                            defaultValue={initialEvent?.expected_attendance}
                            value={event?.expected_attendance}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <AdjustableParameter
                            parameter="staff_team_size"
                            label="Staff Team Size"
                            pricePerUnit={500}
                            unit="members"
                            defaultValue={initialEvent?.staff_team_size}
                            value={event?.staff_team_size}
                            onUpdate={updateParameter}
                            onReset={resetParameter}
                        />
                        <p className="text-gray-600 dark:text-gray-300 text-xl font-extrabold">Videography: {event?.videography ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                {/* <PriceTracker event={event} initialEvent={initialEvent} /> */}

                <div className="px-6 pb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Event Images</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {event?.images?.map((image, index) => (
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
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onConfirm={handleConfirmDate}
            />
        </div>
    );
};

export default CustomizeEvent;