import { useScroll, useTransform, motion as Motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="relative w-full bg-(--black-color) font-sans md:px-10 timeline"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto py-10 ">
                <div className=" mb-12">
                    <div className="font-bold section-heading">
                        <h2>Future</h2>&nbsp;
                        <h2 className="gradient-word">Planning</h2>
                    </div>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm px-27 md:px-8 lg:px-10">
                    Where we&apos;re heading&#58;
                </p>
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20 px-27">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-start pt-10 md:pt-20 md:gap-6 lg:flex-col lg:pt-40 lg:gap-10 xl:flex-row"
                    >
                        <div className="hidden xl:flex sticky flex-col z-40 items-center top-40 self-start max-w-xs xl:max-w-sm">
                            <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                            </div>
                            <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-4 md:pl-4 w-full">
                            <h3 className="xl:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <Motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
