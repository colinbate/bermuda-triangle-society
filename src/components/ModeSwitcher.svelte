<script lang="ts">
    import { onMount } from "svelte";

    const THEME_KEY = "display-theme";

    type Theme = "dark" | "light" | undefined;
    let theme: Theme = $state(undefined);

    function setTheme(newTheme: Theme, save = true) {
        theme = newTheme;
        document.documentElement.classList.toggle("dark", theme === "dark");
        if (theme && save) {
            window.localStorage.setItem(THEME_KEY, theme);
        }
    }

    function toggleMode() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    onMount(() => {
        const saved = window.localStorage.getItem(THEME_KEY) as Theme;
        if (saved == null) {
            setTheme(
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light",
                false,
            );
        } else {
            setTheme(saved);
        }
    });
</script>

{#if theme}
    <button
        type="button"
        aria-label="Toggle dark mode"
        class="group relative rounded-full size-7 bg-mystic-100 dark:bg-mystic-800 hover:bg-mystic-200 dark:hover:bg-mystic-700 shadow-sm ring-1 ring-mystic-200 dark:ring-mystic-700 hover:ring-mystic-300 dark:hover:ring-mystic-600 transition-all duration-200"
        onclick={toggleMode}
    >
        {#if theme === "dark"}
            <i
                class="fa-solid fa-sharp fa-moon w-5 h-5 text-mystic-200 group-hover:text-mystic-300 transition-colors"
                aria-hidden="true"
            ></i>
        {:else}
            <i
                class="fa-solid fa-sharp fa-sun w-5 h-5 text-lantern-500 group-hover:text-lantern-600 transition-colors"
                aria-hidden="true"
            ></i>
        {/if}
    </button>
{/if}
