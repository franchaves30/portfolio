import { Breadcrumbs } from "@/components/breadcrumbs";

export default function ABTestingPost() {
    return (
        <main className="flex flex-col items-center p-12 md:p-24">
            <div className="w-full max-w-3xl text-left">
                <Breadcrumbs currentPage="Why A/B testing is a waste of resources for B2B" />

                <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                    Why A/B testing is a waste of resources for B2B
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
                    <p className="text-xl text-white font-medium italic mb-10">
                        If I hear someone suggest A/B testing in a B2B strategy meeting one more time, I might scream.
                    </p>

                    <p>
                        Don&apos;t get me wrong. Testing is the gold standard for e-commerce. If you are Amazon or Spotify and you have millions of daily active users, moving a button three pixels to the left might yield statistically significant data in an hour.
                    </p>

                    <p>
                        But for most B2B companies? It is a waste of time.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">The problem is the Bell curve</h2>

                    <p>
                        The real issue here isn&apos;t just low traffic. It is that the fundamental statistical laws that make A/B testing work do not apply to B2B companies.
                    </p>

                    <p>
                        A/B testing relies on the Central Limit Theorem (the mathematical foundation behind Gauss&apos;s bell curve). This theorem states that if you have a large enough sample size of independent, identically distributed variables, then the distribution of your data will normalize, allowing you to calculate probability and significance.
                    </p>

                    <p>
                        In a B2B context, the conditions required to use the Central Limit Theorem are almost never met.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">Why the conditions fail</h2>

                    <p>
                        First, the sample size is too small. The theorem requires a large n for the bell curve to form. Most B2B sites do not have enough consistent traffic to reach this threshold within a reasonable timeframe (and 10k visitors per month is usually not enough).
                    </p>

                    <p>
                        Second, data points are rarely independent. In B2B, you often have multiple people from the same company visiting the site, or the same person visiting multiple times from different devices. This violates the assumption of independence.
                    </p>

                    <p>
                        Even if you have one visitor per company, they come from different industries with different needs. They are not comparable &quot;identically distributed&quot; variables.
                    </p>

                    <p>
                        When you run an A/B test without meeting these conditions, the p-value you get is meaningless. You are just looking at noise and finding patterns that do not exist.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">The buying cycle is different</h2>

                    <p>
                        B2B purchases are not impulse buys. No one buys a high-value software license because the demo button was green instead of blue. These are rational decisions involving multiple people over weeks or months. Optimizing for clicks often distracts from actual revenue.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">What you should do instead</h2>

                    <p>
                        If you cannot rely on the stats, you have to lean into insight.
                    </p>

                    <ul className="list-disc list-inside space-y-4">
                        <li>Talk to your teams: Your sales and support teams talk to customers all day. They know exactly where users get confused. That is your optimization roadmap.</li>
                        <li>Watch session recordings: Watching 10 users struggle to find pricing is worth more than 10,000 data points of noise.</li>
                        <li>Run customer interviews: Ask five recent customers what almost stopped them from buying. Fix that.</li>
                    </ul>

                    <p>
                        Find a hypothesis and test it, but with traditional experimentation, not obsessing over statistical significance you can sell to stakeholders. Obsess with your customers instead.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-2xl mt-12 mb-12">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">The takeaway</h3>
                        <p className="text-white">
                            Stop waiting for a dashboard to tell you what to do. In B2B, a 30-minute conversation with a real human beats a 3-month test every time.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
