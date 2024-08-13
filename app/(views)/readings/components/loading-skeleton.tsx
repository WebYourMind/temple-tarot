const Skeleton = ({ className }) => (
  <div aria-live="polite" aria-busy="true" className={className}>
    <span className="inline-flex w-full animate-pulse select-none rounded-md bg-gray-300 leading-none">‌</span>
    <br />
  </div>
);

const SVGSkeleton = ({ className }) => <svg className={className + " animate-pulse rounded bg-gray-300"} />;

const LoadingSkeleton = () => (
  <>
    <div className="my-8 grid max-w-4xl grid-cols-1 gap-8 md:my-20 md:grid-cols-3 lg:grid-cols-3">
      {Array.from(Array(9).keys()).map(() => (
        <div className="w-full pt-6">
          <div className="flex items-center justify-between">
            <p className="mb-1">
              <Skeleton className="w-[120px] max-w-full" />
            </p>
            <div>
              <SVGSkeleton className="h-[15px] w-[15px]" />
            </div>
          </div>
          <a className="flex flex-col space-y-2">
            <h3 className="my-0">
              <Skeleton className="w-[192px] max-w-full" />
            </h3>
            <p>
              <Skeleton className="w-[192px] max-w-full" />
            </p>
          </a>
        </div>
      ))}
    </div>
  </>
);

export default LoadingSkeleton;
