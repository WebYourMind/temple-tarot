// import "./tailwind.css";

const Skeleton = ({ className }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none">‌</span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }) => <svg className={className + " animate-pulse rounded bg-gray-300"} />;

const LoadingSkeleton = () => (
  <>
    <div className="mb-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[160px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[21016px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[21016px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[21016px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[21016px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[280px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[6824px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6824px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6824px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6824px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[200px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[11112px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[11112px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[11112px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[11112px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[224px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[18384px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[18384px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[18384px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[18384px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[160px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[9184px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9184px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9184px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9184px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[144px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[13592px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[13592px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[13592px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[13592px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[144px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[22656px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[22656px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[22656px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[22656px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[216px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[20680px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[20680px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[20680px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[20680px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[176px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[10080px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[10080px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[10080px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[10080px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[32px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[6536px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6536px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6536px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[6536px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[192px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[7160px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[7160px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[7160px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[7160px] max-w-full" />
          </p>
        </a>
      </div>
      <div className="w-full p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <p>
            <Skeleton className="w-[120px] max-w-full" />
          </p>
          <div>
            <SVGSkeleton className="h-[15px] w-[15px]" />
          </div>
        </div>
        <a className="flex flex-col space-y-2">
          <h3>
            <Skeleton className="w-[64px] max-w-full" />
          </h3>
          <p>
            <Skeleton className="w-[9336px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9336px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9336px] max-w-full" />
          </p>
          <p>
            <Skeleton className="w-[9336px] max-w-full" />
          </p>
        </a>
      </div>
    </div>
  </>
);

const SandboxPreview = () => (
  <div className="flex h-full w-full justify-center">
    <LoadingSkeleton />
  </div>
);

export default SandboxPreview;
