import { Breadcrumbs } from "@/components/breadcrumbs";

export default function IncrementalityPost() {
    return (
        <main className="flex flex-col items-center p-12 md:p-24">
            <div className="w-full max-w-3xl text-left">
                <Breadcrumbs currentPage="Incrementality kills innovation" />

                <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                    Incrementality kills innovation
                </h1>

                <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
                    <p className="text-xl text-white font-medium italic mb-10">
                        Everyone loves a 3-5% lift (and dreams of a +10%). It feels safe. It looks good on a quarterly report. It justifies your budget.
                    </p>

                    <p>
                        But if you only chase 10% lifts, you will never find the 10x opportunity.
                    </p>

                    <p>
                        There is a massive difference between linear growth and exponential growth, and most teams are stuck chasing the former while hoping for the latter.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">The difference between &quot;better&quot; and &quot;different&quot;</h2>

                    <p>
                        Linear growth comes from incrementality. It is about doing the same thing, but slightly better. You optimize the funnel. You tweak the copy. You speed up the load time. This is valuable work, but it has a ceiling.
                    </p>

                    <p>
                        Exponential growth comes from innovation. It is about doing something completely different. It is not about making the candle burn 10% longer. It is about inventing the lightbulb.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">The trap of the local maximum</h2>

                    <p>
                        The problem with incrementalism is that it is addictive. It provides a steady stream of small dopamine hits. You run a test, you see a green arrow, and you feel productive. Or you fail or fail to get significance, and you still get rewarded for trying.
                    </p>

                    <p>
                        This creates a trap known as the &quot;local maximum&quot;. You climb to the highest point on your current hill, thinking you have reached the peak. But because you are staring at your feet, making sure you do not stumble, you fail to see the mountain right next to you that is ten times higher.
                    </p>

                    <p>
                        To get to that bigger mountain, you have to go down. You have to stop optimizing the current path and accept the risk of the unknown.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">The cost of optimization in the AI era</h2>

                    <p>
                        This danger is compounded by the speed of the current AI revolution. When the technological landscape shifts every week, the opportunity cost of optimization skyrockets.
                    </p>

                    <p>
                        You cannot afford to spend six months perfecting a workflow or a user interface when AI might make that entire process irrelevant by next quarter. Focusing on slow, incremental gains in a time of exponential change is not just safe. It is suicidal.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">How to break the cycle</h2>

                    <p>
                        You cannot A/B test your way to a breakthrough.
                    </p>

                    <p>
                        To achieve exponential growth, you have to stop asking &quot;how do we improve this number?&quot; and start asking &quot;is this even the right number to be tracking?&quot;.
                    </p>

                    <p>
                        You need to allocate resources to bets that look inefficient on paper. You need to protect the projects that might fail, because they are the only ones with the potential to change the trajectory of the business.
                    </p>

                    <p>
                        And the more ideas you try, the bigger your chances of finding a better way to grow your business.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-2xl mt-12 mb-12">
                        <h3 className="text-xl font-bold text-blue-400 mb-2">The takeaway</h3>
                        <p className="text-white">
                            Optimization is about not losing. Innovation is about winning. You need to decide which game you are playing.
                        </p>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-gray-800 text-sm text-gray-500">
                        <p>P.S.: You cannot do both unless you have a huge team and budget. Trying to do both is the best way to fail in both.</p>
                        <p>P.S. 2: Real innovation will probably require interdepartmental cooperation and alignment. Working in silos is a kind of local maximum of its own.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
