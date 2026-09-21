import { PageTitle } from "@/components/cente/ui";
import { Button } from "@/components/ui/button";
import { useCente } from "@/state/cente-context";

export default function NotificationsPage() {
  const { notifications, markAllRead } = useCente();
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <PageTitle eyebrow="Updates" title="Notifications" />
        <Button variant="ghost" onClick={markAllRead}>Read all</Button>
      </div>
      <div className="panel divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 p-5">
            <span className={`grid size-10 place-items-center rounded-lg ${n.read ? "bg-secondary text-muted-foreground" : "bg-primary/12 text-primary"}`}>
              <span className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{n.body}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted-foreground">{n.time}</span>
              {!n.read && <span className="mx-auto mt-2 block size-2 rounded-full bg-primary" />}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
