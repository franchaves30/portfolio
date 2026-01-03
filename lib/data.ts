export interface PostMetadata {
    id: string;
    title: string;
    description: string;
    tag: "What I Built" | "How I Think";
    slug: string;
    date?: string;
}

export const buildsAndStrategy: PostMetadata[] = [
    {
        id: "how-i-built-this-portfolio",
        title: "How i built this portfolio",
        description: "A case study on building a full-stack AI app with Next.js, Python, and Vercel.",
        tag: "What I Built",
        slug: "how-i-built-this-portfolio",
    },
    {
        id: "ab-testing-waste",
        title: "Why A/B testing is a waste of resources for B2B",
        description: "The hard truth about statistics and sample sizes. Why standard experimentation models fail in the B2B world.",
        tag: "How I Think",
        slug: "why-ab-testing-is-a-waste-of-resources-for-b2b",
    },
    {
        id: "incrementality-kills",
        title: "Incrementality kills innovation",
        description: "Optimization is about not losing. Innovation is about winning. A deep dive into the trap of incremental growth.",
        tag: "How I Think",
        slug: "incrementality-kills-innovation",
    },
];
