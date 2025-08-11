import React from 'react'
import Title from './Title'
import { preview } from '../assets/assets'
import StartRating from './StartRating.jsx'

const Preview = () => {
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30'>
            <Title title="Đánh Giá của khách hàng " subTitle="Các phản hồi của quý khách giúp dịch vụ của chúng tôi thêm hoàn thiện để mỗi khi quý khách đến với chúng tôi thì sẽ là một trải nghiệm tuyệt vời." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 w-full">
                {preview.map((preview) => (
                    <div key={preview.id} className="bg-white p-6 rounded-xl shadow h-full w-full flex flex-col">
                        <div className="flex items-start gap-3">
                            <img className="w-12 h-12 rounded-full" src={preview.image} alt={preview.name} />
                            <div>
                                <p className="font-playfair text-xl">{preview.name}</p>
                                <p className="text-gray-500">{preview.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            <StartRating/>
                        </div>
                        <p className="text-gray-500 mt-4">"{preview.review}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Preview
