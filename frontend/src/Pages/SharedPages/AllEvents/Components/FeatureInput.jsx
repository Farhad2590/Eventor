import { Button, Input } from '@mui/material';
import { useState } from 'react';


const FeatureInput = ({ features, onFeatureAdd }) => {
  const [newFeature, setNewFeature] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      onFeatureAdd(newFeature.trim());
      setNewFeature('');
      setIsInputVisible(false);
    }
  };

  const handleCancel = () => {
    setNewFeature('');
    setIsInputVisible(false);
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Features:</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {features?.map((feature, index) => (
          <div key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {feature}
          </div>
        ))}
        {!isInputVisible && (
          <div
            className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm cursor-pointer"
            onClick={() => setIsInputVisible(true)}
          >
            +Add Feature
          </div>
        )}
      </div>
      {isInputVisible && (
        <div className="flex items-center mt-2">
          <Input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Enter new feature"
            className="mr-2"
          />
          <Button onClick={handleAddFeature} className="mr-2">Add</Button>
          <Button onClick={handleCancel} variant="outline">Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default FeatureInput;