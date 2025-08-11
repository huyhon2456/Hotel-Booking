import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-[var(--color-2)] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-10 opacity-80 ' />
                    <p className='text-sm'>
                        Nơi bạn có thể tìm thấy những nơi lưu trú tốt nhất với giá cả hợp lý nhất. Chúng tôi cung cấp cho bạn những trải nghiệm tuyệt vời nhất với những dịch vụ tốt nhất.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        {/* Instagram */}
                        <img src={assets.instagramIcon} alt="instagraam-icon" className='w-6' />
                        {/* Facebook */}
                        <img src={assets.facebookIcon} alt="facebook-icon" className='w-6' />
                        {/* Twitter */}
                        <img src={assets.twitterIcon} alt="twitter-icon" className='w-6' />
                        {/* Linkendin */}
                        <img src={assets.linkendinIcon} alt="linkendin-icon" className='w-6' />
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>BOOKING HOTEL</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Cơ hội việc làm</a></li>
                        <li><a href="#">Báo chí</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Đối tác</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>HỖ TRỢ</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Trung tâm trợ giúp</a></li>
                        <li><a href="#">Thông tin an toàn</a></li>
                        <li><a href="#">Tùy chọn hủy bỏ</a></li>
                        <li><a href="#">Liên hệ với chúng tôi</a></li>
                        <li><a href="#">Khả năng tiếp cận</a></li>
                    </ul>
                </div>

                <div className='font-playfair max-w-80'>
                    <p className='text-lg text-gray-800'>STAY WITH US</p>
                    <p className='mt-3 text-sm'>
                        Đăng ký để nhận thông tin mới nhất về các ưu đãi và khuyến mãi đặc biệt từ chúng tôi.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-[var(--color-1)] h-9 w-9 aspect-square rounded-r'>
                            {/* Arrow icon */}
                           <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert'/>
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Chính sách bảo mật</a></li>
                    <li><a href="#">Điều Khoản</a></li>
                    <li><a href="#">Sơ Đồ Trang</a></li>
                </ul>
            </div>
        </div>
  )
}

export default Footer
