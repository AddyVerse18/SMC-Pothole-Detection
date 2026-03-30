import MapView from '../components/map/MapView';
import ActivityFeed from '../components/feed/ActivityFeed';
import KpiHeader from '../components/kpi/KpiHeader';

function DashboardContent() {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-slate-100/50 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[55vh] md:h-full overflow-y-auto md:overflow-hidden">
        <KpiHeader />
        
        {/* Map Container */}
        <div className="flex-1 p-3 md:p-4 pb-3 md:pb-4 min-h-0">
          <MapView />
        </div>
      </div>

      {/* Right Sidebar Feed */}
      <div className="h-[45vh] md:h-full w-full md:w-[340px] flex-shrink-0">
        <ActivityFeed />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
