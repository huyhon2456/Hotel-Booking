import React from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'
import { useState } from 'react'

const HotelRegister = () => {


    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext()

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post('/api/hotel/', {
                name,
                contact,
                address,
                city
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                toast.success(data.message);
                setIsOwner(true);
                setShowHotelReg(false);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div onClick={() => setShowHotelReg(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70 '>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
                <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block' />

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' onClick={() => setShowHotelReg(false)} />
                    <p className='text-2xl font-semibold mt-6 text-[var(--color-3)]'>Register Your Hotel</p>

                    {/*tên khách sạn */}
                    <div className='w-full mt-4'>
                        <label htmlFor="name" className='font-medium text-[var(--color-3)]'>
                            Hotel Name
                        </label>
                        <input id='name' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='VD: Luxury Hotel' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                    </div>
                    {/*Liên hệ */}
                    <div className='w-full mt-4'>
                        <label htmlFor="contact" className='font-medium text-[var(--color-3)]'>
                            Phone
                        </label>
                        <input onChange={(e) => setContact(e.target.value)} value={contact} id='contact' type="text" placeholder='...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                    </div>
                    {/*Địa chỉ */}
                    <div className='w-full mt-4'>
                        <label htmlFor="address" className='font-medium text-[var(--color-3)]'>
                            Address
                        </label>
                        <input onChange={(e) => setAddress(e.target.value)} value={address} id='address' type="text" placeholder='...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)] font-light required' />
                    </div>
                    {/*Thành phố */}
                    <div className='w-full mt-4 max-w-60 mr-auto'>
                        <label htmlFor="city" className='font-medium text-[var(--color-3)]'>City</label>
                        <select onChange={(e) => setCity(e.target.value)} value={city} id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-[var(--color-1)]font-light required'>
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option value={city} key={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <button className='bg-[var(--color-1)] hover:bg-[var(--color-2)] trasition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 hover:text-[var(--color-4)]'>Register</button>
                </div>

            </form>

        </div>
    )
}

export default HotelRegister
