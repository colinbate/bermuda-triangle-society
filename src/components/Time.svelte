<script lang="ts">
    interface Props {
        start: Date;
        duration: number;
    }

    const { start, duration }: Props = $props();

    const end = $derived(new Date(start.getTime() + duration * 60_000));

    function fmt(d: Date) {
        return d.toLocaleTimeString([], {
            timeZone: "utc",
            hour: "numeric",
            minute: "2-digit",
        });
    }
</script>

<div>{fmt(start)} &ndash; {fmt(end)}</div>
