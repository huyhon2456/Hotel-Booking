import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'


const AddRoom = () => {

  const { axios, getToken, formatPrice, currency } = useAppContext()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })
  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
  "WiFi siêu mạnh": false,
      "Miễn phí ăn sáng": false,
      "Dịch vụ phòng": false,
      "Tầm nhìn núi": false,
      "Truy cập hồ bơi": false
    }
  })

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    //kiểm tra xem tất cả đã đc nhập hết chưa
    if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
      toast.error("Vui lòng điền đầy đủ thông tin và chọn ảnh phòng");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData()
      formData.append('roomType', inputs.roomType);
      formData.append('pricePerNight', Number(inputs.pricePerNight));
      //biến các tiện ích thành chuỗi và giữ nguyên định dạng
      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
      formData.append('amenities', JSON.stringify(amenities));

      //thêm ảnh vào formData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append('images', images[key]);
      });

      const { data } = await axios.post('/api/rooms/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } });

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            "WiFi siêu mạnh": false,
            "Miễn phí ăn sáng": false,
            "Dịch vụ phòng": false,
            "Tầm nhìn núi": false,
            "Truy cập hồ bơi": false
          }
        })
        setImages({
          1: null,
          2: null,
          3: null,
          4: null
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi thêm phòng");
    } finally {
      setLoading(false);
    }

  }
  return (
    <form onSubmit={onSubmitHandler}>
      <Title title='Thêm phòng' align='left' font='Roboto' subTitle='Cho khách hàng có nhiều lựa chọn hơn' />
      {/*thêm ảnh */}
      <p className='text-gray-800 mt-10'>Ảnh</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img className={`max-h-20 cursor-pointer opacity-80 invert `} src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
            <input type="file" accept="image/*" id={`roomImage${key}`} hidden onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
          </label>
        ))}
      </div>


      <div className='flex w-full max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Kiểu Phòng</p>
          <select value={inputs.roomType} onChange={e => setInputs({ ...inputs, roomType: e.target.value })} className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full '>
            <option value="">Chọn kiểu phòng</option>
            <option value="Phòng đơn">Phòng đơn</option>
            <option value="Phòng đôi">Phòng đôi</option>
            <option value="Phòng gia đình">Phòng gia đình</option>
            <option value="Phòng Vip">Phòng Vip</option>
          </select>
        </div>        <div>
          <p className='text-gray-800 mt-4'>
            Giá <span className='text-xs'>/đêm</span>
          </p>
          <div className="flex items-center">
            <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded-l p-2 w-24' value={inputs.pricePerNight} onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })} />
           
          </div>
        </div>
      </div>

      <p className='text-gray-800 mt-4'>Các Tiện Ích</p>
      <div className='flex flex-col flex-wrap mt-1 text-[var(--color-4)]max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input type="checkbox" id={`amenities${index + 1}`} checked={inputs.amenities[amenity]} onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })} className="accent-[var(--color-2)]" />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>
      <button className='bg-[var(--color-1)] text-white rounded px-8 py-2 mt-8 hover:bg-[var(--color-1)]/50 transition-all cursor-pointer hover:text-black' disabled={loading}>
        {loading ? "Đang thêm phòng..." : "Thêm Phòng"}
      </button>
    </form>
  )
}

export default AddRoom
