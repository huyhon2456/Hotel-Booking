import React from 'react'
import { useState } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const ListRoom = () => {
  const [rooms, setRooms] = useState([])
  const { axios, getToken, user, currency, formatPrice } = useAppContext()

  //fetch room từ owner
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms/owner', { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy danh sách phòng");
    }
  }

  //trạng thái của phòng
  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post('/api/rooms/toggle-availability', { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } });
    if (data.success) {
      toast.success(data.message);
      fetchRooms(); // Cập nhật lại danh sách phòng sau khi thay đổi trạng thái
    } else {
      toast.error(data.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user])
  return (
    <div>
      <Title align='left' font='Roboto' title='Danh sách các phòng' subTitle='Ai cho tôi lương thiện' />
      <p className='text-gray-500 mt-8'>Tất cả phòng</p>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded max-h-80 overflow-y-scroll mt-3'>
        <table className='w-full '>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Tên </th>
              <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Tiện Nghi</th>
              <th className='py-3 px-4 text-gray-800 font-medium '>Giá / đêm</th>
              <th className='py-3 px-4 text-gray-800 font-medium
              text-center'>Trạng thái</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {rooms.map((item, index) => (
              <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {item.roomType}
                </td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                  {item.amenities.join(', ')}
                </td>                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {formatPrice(item.pricePerNight)}
                </td>
                <td className='py-3 px-4 text-red-500 text-sm border-t border-gray-300 text-center'>
                  <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                    <input onChange={() => toggleAvailability(item._id)} type="checkbox" className='sr-only peer' checked={item.isAvailable} />
                    <div className='w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-[var(--color-1)] transition-colors duration-200'>

                    </div>
                    <span className='dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out peer-checked:translate-x-5'>

                    </span>
                  </label>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  )
}

export default ListRoom
