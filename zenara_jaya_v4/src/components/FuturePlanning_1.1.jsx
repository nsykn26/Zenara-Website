import React from "react";
import { Timeline } from "./ui/timeline";
import marketHorizonImg from "../assets/market-horizon.jpg";
import aiChatbotImg from "../assets/ai-chatbot.jpg";
import ecomAutoImg from "../assets/ecommerce-automation.jpg";
import predAnalysisImg from "../assets/predictive-analysis.jpg";
import workflowImg from "../assets/workflow-automation.jpg";
import aibrandingImg from "../assets/branding-ai.jpg";

export default function FuturePlanning() {
    const data = [
        {
            title: "Market Horizons",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Gain AI-powered insights into asset worth, 
                            market shifts, and future opportunities.
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Spot opportunities & risks early for better capital allocation and pricing decisions.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={marketHorizonImg}
                            alt="startup template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "AI Chatbot Platform",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                            Deliver 24/7 customer support with smart, conversational 
                            bots that understand context and emotion.
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                       Cut response times and scale support 24/7 without proportional headcount growth.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={aiChatbotImg}
                            alt="hero template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "E-Commerce Automation",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                            Boost sales with AI-driven product recommendations and 
                            seamless order automation workflows.
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                            Reduce manual errors, raise conversion, and run promotions & orders around the clock.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={ecomAutoImg}
                            alt="hero template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Predictive Analysis",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                    
                            Turn your data into clear forecasts, trends, 
                            and actionable insights with advanced visualization.
                        
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                           Anticipate demand, reduce churn, and optimize inventory & staffing ahead of time.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={predAnalysisImg}
                            alt="hero template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Workflow Automation",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                         
                            Automate repetitive tasks and streamline operations 
                            with AI precision and intelligent decision-making.
                        
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                            Free people from repetitive tasks, increase consistency, and lower operating cost.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={workflowImg}
                            alt="hero template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Branding with AI",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                         
                            Build and refine a strong, adaptive brand identify using 
                            intelligent design tools and market analysis.
                        
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                           Keep brand consistent, test creatives faster, and position using real audience data.
                    </p>
                    <div className="grid grid-cols-1">
                        <img
                            src={aibrandingImg}
                            alt="hero template"
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <section id="future-planning" className="future-planning-section w-full antialiased">
            <div className="outer">
                <div className="inner">
                    <Timeline data={data} />
                </div>
            </div>
        </section>
    );
}
