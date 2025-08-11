import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PaymentResult = () => {
  const { axios, getToken } = useAppContext();
  const [result, setResult] = useState({ status: 'processing', message: 'Đang xử lý kết quả thanh toán...' });
  const [bookingId, setBookingId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hàm kiểm tra trạng thái thanh toán từ backend
  const checkPaymentStatus = async (id, vnpResponse = null) => {
    try {
      const token = await getToken();
      
      // Nếu có thông tin từ VNPay, gửi API để cập nhật trạng thái
      if (vnpResponse) {
        try {
          const { data } = await axios.post(`/api/bookings/update-payment/${id}`, 
            { vnpResponse },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          
          if (data.success) {
            setResult({
              status: 'success',
              message: 'Thanh toán thành công! Đơn đặt phòng của bạn đã được xác nhận.'
            });
            return;
          }
        } catch (updateError) {
          // Silent error handling
        }
      }
      
      // Kiểm tra trạng thái hiện tại
      const { data } = await axios.get(`/api/bookings/check-payment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success && data.isPaid) {
        setResult({
          status: 'success',
          message: 'Thanh toán thành công! Đơn đặt phòng của bạn đã được xác nhận.'
        });
      } else if (data.success && data.paymentDetails?.status === 'pending') {
        // Nếu trạng thái vẫn đang chờ, hiển thị thông báo phù hợp
        setResult({
          status: 'processing',
          message: 'Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát...'
        });
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: `Lỗi kiểm tra: ${error.response?.data?.message || error.message}`
      });
    }
  };
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Kiểm tra tham số từ VNPay trước
    const vnp_ResponseCode = params.get('vnp_ResponseCode');
    const vnp_TransactionStatus = params.get('vnp_TransactionStatus');
    const vnp_TxnRef = params.get('vnp_TxnRef');
    
    // Kiểm tra nếu có tham số từ VNPay
    if (vnp_ResponseCode) {
      // Trích xuất bookingId từ vnp_TxnRef
      if (vnp_TxnRef) {
        const bookingId = vnp_TxnRef.split('-')[0];
        setBookingId(bookingId);
        
        // Lưu bookingId vào sessionStorage nếu chưa có
        if (!sessionStorage.getItem('vnpay_booking_id')) {
          sessionStorage.setItem('vnpay_booking_id', bookingId);
        }
      }
      
      // Chuẩn bị dữ liệu VNPay để gửi đến API
      const vnpData = {};
      params.forEach((value, key) => {
        if (key.startsWith('vnp_')) {
          vnpData[key] = value;
        }
      });
      
      // Mã 00 là thành công theo tài liệu VNPay
      if (vnp_ResponseCode === '00' && vnp_TransactionStatus === '00') {
        setResult({
          status: 'processing',
          message: 'Đang xác nhận giao dịch thành công...'
        });
        
        // Gọi API để cập nhật trạng thái với thông tin VNPay
        const bookingId = vnp_TxnRef.split('-')[0];
        checkPaymentStatus(bookingId, vnpData);
        
        // Xóa dữ liệu sessionStorage vì đã thành công
        sessionStorage.removeItem('vnpay_booking_id');
        sessionStorage.removeItem('vnpay_payment_time');
        return;
      } else if (vnp_ResponseCode) {
        setResult({
          status: 'error',
          message: `Thanh toán thất bại! (Mã lỗi từ VNPay: ${vnp_ResponseCode})`
        });
        
        // Thêm nút để người dùng có thể thử lại
        if (vnp_TxnRef) {
          const bookingId = vnp_TxnRef.split('-')[0];
          setBookingId(bookingId);
        }
        return;
      }
    }
    
    // Nếu không có tham số VNPay, kiểm tra tham số thông thường
    const status = params.get('status');
    const message = params.get('message') || '';
    const code = params.get('code') || '';
    
    // Lấy bookingId từ sessionStorage (nếu chưa có từ VNPay)
    const storedBookingId = sessionStorage.getItem('vnpay_booking_id');
    if (storedBookingId && !bookingId) {
      setBookingId(storedBookingId);
      // Kiểm tra trạng thái thanh toán
      checkPaymentStatus(storedBookingId);
    }
    
    // Xử lý theo tham số status thông thường
    if (status === 'success') {
      setResult({
        status: 'success',
        message: 'Thanh toán thành công! Đơn đặt phòng của bạn đã được xác nhận.'
      });
      
      // Xóa bookingId khỏi sessionStorage vì đã hoàn thành
      sessionStorage.removeItem('vnpay_booking_id');
      sessionStorage.removeItem('vnpay_payment_time');
    } else if (status === 'error') {
      setResult({
        status: 'error',
        message: message || `Thanh toán thất bại! (Mã lỗi: ${code})`
      });
    } else if (!vnp_ResponseCode) {
      // Nếu không có cả tham số status và vnp_ResponseCode
      
      // Chờ lâu hơn trước khi chuyển hướng để đảm bảo có thể kiểm tra lỗi
      const timer = setTimeout(() => {
        navigate('/my-bookings');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);
  
  // Kiểm tra trạng thái thanh toán khi component được mount và có id trong URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const status = params.get('status');
    
    if (id) {
      setBookingId(id);
      // Thu thập dữ liệu VNPay nếu có
      const vnpData = {};
      params.forEach((value, key) => {
        if (key.startsWith('vnp_')) {
          vnpData[key] = value;
        }
      });
      
      // Gọi API với hoặc không có dữ liệu VNPay
      const hasVnpData = Object.keys(vnpData).length > 0;
      checkPaymentStatus(id, hasVnpData ? vnpData : null);
      
      // Nếu trạng thái là success từ backend nhưng không có dữ liệu VNPay
      // (có thể do backend đã lưu nhưng frontend cần hiển thị)
      if (status === 'success' && !hasVnpData) {
        // Kiểm tra lại sau 1 giây để đảm bảo booking được cập nhật
        const timer = setTimeout(() => {
          checkPaymentStatus(id);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location, checkPaymentStatus]);
  
  // Kiểm tra tự động mỗi 5 giây nếu đang ở trạng thái processing
  useEffect(() => {
    if (result.status === 'processing' && bookingId) {
      const timer = setTimeout(() => {
        checkPaymentStatus(bookingId);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [result.status, bookingId, checkPaymentStatus]);
  
  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Kết quả thanh toán</h2>
        <div className={`p-6 text-center rounded-lg ${result.status === 'success' ? 'bg-green-50' : result.status === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}>
          {result.status === 'success' ? (
            <>
              <div className="text-5xl text-green-500 mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-700 mb-2">Thanh toán thành công!</h3>
            </>
          ) : result.status === 'error' ? (
            <>
              <div className="text-5xl text-red-500 mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Thanh toán thất bại!</h3>
            </>
          ) : (
            <div className="text-blue-500 text-2xl mb-4">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Đang xử lý...</span>
              </div>
            </div>
          )}
          <p className="text-gray-700">{result.message}</p>
          
          {/* Hiển thị thông tin chi tiết nếu là thanh toán thành công */}
          {result.status === 'success' && bookingId && (
            <div className="mt-4 text-left text-sm bg-green-100 p-3 rounded">
              <p className="font-medium">Mã đơn hàng: {bookingId}</p>
              <p>Vui lòng lưu lại thông tin này để tra cứu đơn hàng khi cần.</p>
            </div>
          )}
          
          {/* Hiển thị thông tin nếu đang xử lý */}
          {result.status === 'processing' && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Hệ thống đang xử lý giao dịch của bạn. Quá trình này có thể mất vài giây.</p>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => navigate('/my-bookings')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Xem đơn đặt phòng
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Trở về trang chủ
          </button>
          {bookingId && result.status !== 'success' && (
            <button 
              onClick={() => {
                // Lấy dữ liệu VNPay từ URL nếu có
                const params = new URLSearchParams(location.search);
                const vnpData = {};
                params.forEach((value, key) => {
                  if (key.startsWith('vnp_')) {
                    vnpData[key] = value;
                  }
                });
                
                // Kiểm tra xem có dữ liệu VNPay không
                const hasVnpData = Object.keys(vnpData).length > 0;
                
                // Gọi API kiểm tra với hoặc không có dữ liệu VNPay
                checkPaymentStatus(bookingId, hasVnpData ? vnpData : null);
              }}
              className="px-6 py-2 mt-3 w-full bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Kiểm tra lại trạng thái thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
