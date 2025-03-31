import { useState, useEffect } from "react";

const RateBlock = ({ name, title, handleTRating, value }) => {
    const [rating, setRating] = useState(value || 1);
    const totalBlocks = 10;

    useEffect(() => {
        handleTRating(name, rating);
    }, [rating]);

    return (
        <div className="flex items-center">
            <div className="block mr-2 basis-auto min-w-[60px]">{title}</div>

            <span className="flex items-center justify-center border border-gray-300 p-1 rounded-[50%] min-w-[20px] h-[20px] mr-3">
                ?
            </span>

            <div className="grid grid-cols-10 gap-2 grow">
                {[...Array(totalBlocks)].map((_, index) => (
                    <div
                        key={index}
                        className={`min-w-[20px] h-[20px] cursor-pointer transition-colors border border-gray-300 ${
                            index + 1 <= rating ? "bg-green-800" : "bg-white"
                        }`}
                        onClick={() => setRating(index + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RateBlock;
