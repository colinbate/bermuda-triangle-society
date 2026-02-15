<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    interface Props {
        start: Date;
        duration: number;
        class?: ClassValue;
    }

    const { start, duration, class: className }: Props = $props();

    const end = $derived(new Date(start.getTime() + duration * 60_000));

    function fmt(d: Date) {
        return d.toLocaleTimeString([], {
            timeZone: "utc",
            hour: "numeric",
            minute: "2-digit",
        });
    }
</script>

<span class={className}>{fmt(start)} &ndash; {fmt(end)}</span>
