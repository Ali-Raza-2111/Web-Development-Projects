import { useState } from "react";

export default function LikeButton() {
    let [isLiked,setisLiked] = useState(false);

    let toggle = () => {
        setisLiked(!isLiked);
    }
    return (
        <h2>
            <span onClick={toggle}>
                {isLiked ?
                <i class="fa-solid fa-heart"></i>:
                <i className="fa-regular fa-heart" ></i>

                }
            </span>
        </h2>
    );
}