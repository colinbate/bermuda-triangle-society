<script lang="ts">
    import { onMount } from "svelte";
    import { archiveApiUrl } from "../lib/archive";

    type LinkStatus =
        | "starter"
        | "featured"
        | "discussed"
        | "mentioned_off_theme";

    type SubjectLink = {
        linkStatus: LinkStatus;
        linkNote: string | null;
        linkedAt: string;
        updatedAt: string;
    };

    type Book = SubjectLink & {
        type: "book";
        id: string;
        slug: string;
        title: string;
        subtitle: string | null;
        authorText: string | null;
        coverUrl: string | null;
        amazonAsin: string | null;
        goodreadsUrl: string | null;
        description: string | null;
    };

    type Series = SubjectLink & {
        type: "series";
        id: string;
        slug: string;
        title: string;
        authorText: string | null;
        description: string | null;
        coverUrl: string | null;
        amazonAsin: string | null;
        goodreadsUrl: string | null;
        isComplete: boolean;
        bookCount: number | null;
    };

    type Subject = Book | Series;

    type SubjectsResponse = {
        sessionId: string;
        books: Book[];
        series: Series[];
    };

    interface Props {
        sessionId: string;
        apiBaseUrl?: string;
    }

    const { sessionId, apiBaseUrl }: Props = $props();

    let subjects = $state<Subject[]>([]);
    let isLoading = $state(true);
    let didFail = $state(false);

    const groups: { status: LinkStatus; title: string; icon: string }[] = [
        {
            status: "starter",
            title: "Starter List",
            icon: "fa-solid fa-sharp fa-books",
        },
        {
            status: "featured",
            title: "Featured",
            icon: "fa-solid fa-sharp fa-star",
        },
        {
            status: "discussed",
            title: "Discussed",
            icon: "fa-solid fa-sharp fa-comments",
        },
        {
            status: "mentioned_off_theme",
            title: "Also Mentioned",
            icon: "fa-solid fa-sharp fa-sparkles",
        },
    ];

    function subjectUrl(subject: Subject) {
        if (subject.goodreadsUrl) {
            return subject.goodreadsUrl;
        }

        if (subject.amazonAsin) {
            return `https://www.amazon.com/dp/${subject.amazonAsin}`;
        }

        return null;
    }

    onMount(async () => {
        try {
            const response = await fetch(
                archiveApiUrl(
                    `/api/v1/sessions/${sessionId}/subjects`,
                    apiBaseUrl,
                ),
            );

            if (!response.ok) {
                throw new Error(`Archive subjects returned ${response.status}`);
            }

            const data = (await response.json()) as SubjectsResponse;
            subjects = [...data.books, ...data.series].sort((a, b) =>
                a.linkedAt.localeCompare(b.linkedAt),
            );
        } catch {
            didFail = true;
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="session-subjects">
    {#if isLoading}
        <div class="space-y-3" aria-busy="true" aria-live="polite">
            <h3
                class="text-xl font-display font-semibold text-mystic-800 dark:text-mystic-200 mb-4 flex items-center gap-2"
            >
                <span class="text-lantern-500">
                    <i class="fa-solid fa-sharp fa-books"></i>
                </span>
                Books & Series
            </h3>
            {#each { length: 3 } as _, index (index)}
                <div
                    class="h-20 rounded-xl border border-mystic-100 dark:border-mystic-700 bg-white/70 dark:bg-mystic-950/70 animate-pulse"
                ></div>
            {/each}
            <span class="sr-only">Loading books and series</span>
        </div>
    {:else if didFail}
        <div
            class="bg-mystic-50 dark:bg-mystic-900 rounded-2xl p-6 border border-mystic-100 dark:border-mystic-800 text-center"
        >
            <span class="text-4xl text-mystic-400 mb-4 block">
                <i class="fa-solid fa-sharp fa-books"></i>
            </span>
            <h3
                class="font-display font-semibold text-mystic-800 dark:text-mystic-200 mb-2"
            >
                Books Unavailable
            </h3>
            <p class="text-mystic-600 dark:text-mystic-400 text-sm">
                The Archive could not load the books for this session.
            </p>
        </div>
    {:else if subjects.length === 0}
        <div
            class="bg-mystic-50 dark:bg-mystic-900 rounded-2xl p-6 border border-mystic-100 dark:border-mystic-800 text-center"
        >
            <span class="text-4xl text-mystic-400 mb-4 block">
                <i class="fa-solid fa-sharp fa-books"></i>
            </span>
            <h3
                class="font-display font-semibold text-mystic-800 dark:text-mystic-200 mb-2"
            >
                Starter List Coming Soon
            </h3>
            <p class="text-mystic-600 dark:text-mystic-400 text-sm">
                We'll build the starter list together at the meeting before this
                session.
            </p>
        </div>
    {:else}
        <div
            class="bg-linear-to-br from-mystic-50 to-bermuda-50 dark:from-mystic-900 dark:to-mystic-950 rounded-2xl p-6 border border-mystic-100 dark:border-mystic-950"
        >
            {#each groups as group (group.status)}
                {@const groupSubjects = subjects.filter(
                    (subject) => subject.linkStatus === group.status,
                )}
                {#if groupSubjects.length > 0}
                    <section class="mb-8 last:mb-0">
                        <h3
                            class="text-xl font-display font-semibold text-mystic-800 dark:text-mystic-200 mb-4 flex items-center gap-2"
                        >
                            <span class="text-lantern-500">
                                <i class={group.icon}></i>
                            </span>
                            {group.title}
                        </h3>

                        <ul class="space-y-4">
                            {#each groupSubjects as subject (subject.id)}
                                {@const url = subjectUrl(subject)}
                                <li
                                    class={[
                                        "group bg-white dark:bg-mystic-950 relative rounded-xl border border-mystic-100 dark:border-mystic-700 transition-all duration-200 p-4",
                                        url
                                            ? "hover:border-mystic-200 dark:hover:border-mystic-600 hover:shadow-md"
                                            : "",
                                    ]}
                                >
                                    <svelte:element
                                        this={url ? "a" : "div"}
                                        href={url}
                                        target={url ? "_blank" : undefined}
                                        rel={url
                                            ? "noopener noreferrer"
                                            : undefined}
                                        class="flex gap-3"
                                    >
                                        {#if subject.coverUrl}
                                            <img
                                                src={subject.coverUrl}
                                                alt=""
                                                class="w-12 h-16 rounded object-cover bg-mystic-100 dark:bg-mystic-800 shrink-0"
                                                loading="lazy"
                                            />
                                        {/if}

                                        <div class="min-w-0 flex-1">
                                            <h4
                                                class={[
                                                    "font-semibold text-mystic-900 dark:text-mystic-100 transition-colors",
                                                    url
                                                        ? "group-hover:text-bermuda-600 dark:group-hover:text-bermuda-400"
                                                        : "",
                                                ]}
                                            >
                                                {subject.title}
                                                {#if subject.type === "series"}
                                                    <span
                                                        class="ml-1 text-xs font-medium text-mystic-500 dark:text-mystic-400"
                                                        >series</span
                                                    >
                                                {/if}
                                                {#if url}
                                                    <i
                                                        class="fa-solid fa-sharp fa-arrow-up-right-from-square text-xs ml-1 opacity-50"
                                                        aria-hidden="true"
                                                    ></i>
                                                {/if}
                                            </h4>

                                            {#if subject.authorText}
                                                <p
                                                    class="text-sm text-mystic-600 dark:text-mystic-400"
                                                >
                                                    by {subject.authorText}
                                                </p>
                                            {/if}

                                            {#if subject.linkNote}
                                                <p
                                                    class="text-sm text-mystic-500 dark:text-mystic-400 italic border-l-2 border-lantern-300 dark:border-lantern-600 pl-3 mt-2"
                                                >
                                                    {subject.linkNote}
                                                </p>
                                            {/if}
                                        </div>
                                    </svelte:element>
                                </li>
                            {/each}
                        </ul>
                    </section>
                {/if}
            {/each}
        </div>
    {/if}
</div>
