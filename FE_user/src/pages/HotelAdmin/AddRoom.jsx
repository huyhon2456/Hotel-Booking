import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const AddRoom = () => {

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
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false
    }
  })
  return (
    <form>
      <Title title='Thêm phòng' align='left' font='Roboto' subTitle='thêm các phòng giúp .....' />
      {/*thêm ảnh */}
      <p className='text-gray-800 mt-10'>Ảnh</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img className={`max-h-13 cursor-pointer opacity-80 ${!images[key] ? 'invert' : ''}`} src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
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
        </div>
        <div>
          <p className='text-gray-800 mt-4'>
            Giá <span className='text-xs'>/đêm</span>
          </p>
          <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerNight} onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })} />
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
      <button className='bg-[var(--color-1)] text-white rounded px-8 py-2 mt-8 hover:bg-[var(--color-1)]/50 transition-all cursor-pointer hover:text-black'>
        Thêm Phòng
      </button>
    </form>
  )
}

export default AddRoom
