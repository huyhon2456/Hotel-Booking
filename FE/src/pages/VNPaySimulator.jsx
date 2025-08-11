import React from 'react';
import { useNavigate } from 'react-router-dom';


const VNPaySimulator = () => {
  const navigate = useNavigate();

 
  const simulateSuccess = () => {
    window.location.href = "/payment-result?status=success";
  };

  const simulateError = () => {
    window.location.href = "/payment-result?status=error&code=24&message=Giao%20dịch%20không%20thành%20công";
  };

  const simulateTimeout = () => {
    setTimeout(() => {
      window.location.href = "/payment-result";
    }, 5000);
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">VNPay Simulator</h2>
        <p className="mb-4 text-gray-700">
          Đây là công cụ giúp kiểm thử các kịch bản trả về từ VNPay mà không cần thực hiện thanh toán thật.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <button 
            onClick={simulateSuccess}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Giả lập thanh toán thành công
          </button>
          <button 
            onClick={simulateError}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Giả lập thanh toán thất bại
          </button>
          <button 
            onClick={simulateTimeout}
            className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
          >
            Giả lập timeout
          </button>
          <button 
            onClick={() => navigate('/my-bookings')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPaySimulator;
