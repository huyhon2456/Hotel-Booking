import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const VNPayPaymentButton = ({ bookingId, className }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axios, getToken } = useAppContext();

  const handleVnpayPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      
      // Hiển thị thông báo cho người dùng
      toast.loading('Đang kết nối với VNPay...');
      
      const { data } = await axios.post(
        '/api/bookings/vnpay-payment', 
        { bookingId },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      
      if (data.success && data.paymentUrl) {
        toast.success('Đang chuyển đến trang thanh toán VNPay');
        
        // Lưu bookingId vào sessionStorage để kiểm tra khi quay lại
        sessionStorage.setItem('vnpay_booking_id', bookingId);
        sessionStorage.setItem('vnpay_payment_time', new Date().toISOString());
        
        // Chuyển hướng người dùng đến trang thanh toán VNPay
        window.location.href = data.paymentUrl;
      } else {
        // Xử lý lỗi
        toast.dismiss();
        toast.error(data.message || 'Không thể tạo URL thanh toán');
        setError(data.message || 'Không thể tạo URL thanh toán');
      }
    } catch (error) {
      toast.dismiss();
      setError(error.response?.data?.message || error.message || 'Lỗi khi gọi API thanh toán');
      toast.error("Lỗi khi thanh toán: " + (error.response?.data?.message || error.message || 'Đã xảy ra lỗi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        className={`${className || 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleVnpayPayment}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <img 
              src="https://sandbox.vnpayment.vn/Images/brands/logo.svg" 
              alt="VNPAY Logo" 
              className="h-4 mr-2" 
            />
            Thanh toán bằng VNPAY
          </span>
        )}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default VNPayPaymentButton;
