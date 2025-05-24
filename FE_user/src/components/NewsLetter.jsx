import React from 'react'
import { assets } from '../assets/assets'
import Title from './Title'

const NewsLetter = () => {
    return (
        <div className="flex flex-col items-center max-w-5xl lg:w-full rounded-2xl px-4 py-12 md:py-16 mx-2 lg:mx-auto my-30 bg-[var(--color-1)] text-white">
            <Title title='Gắn kết với chúng tôi'/> 
            Theo dõi chúng tôi để không bỏ lỡ bất kì hoạt động nào vì sắp tới nó hơi lớn đó!!
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
                <input type="text" className="bg-[var(--color-2)]/10 px-4 py-2.5 border border-white/20 rounded outline-none max-w-66 w-full" placeholder="Email của bạn" />
                <button className="flex items-center justify-center gap-2 group bg-[var(--color-2)]/10 border border-white/20 px-4 md:px-7 py-2.5 rounded active:scale-95 transition-all">Subscribe
                  <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert group-hover:translate-x-1 transition-all' />  
                </button>
            </div>
            <p className="text-white mt-6 text-xs text-center">Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi và đồng ý nhận thông tin cập nhật.</p>
        </div>
    )
}

export default NewsLetter
