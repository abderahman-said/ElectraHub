const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-gray-100 animate-pulse">
            {/* Image skeleton */}
            <div className="h-[250px] bg-slate-200"></div>

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
                {/* Price section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
                </div>

                {/* Title skeleton */}
                <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                </div>

                {/* Suppliers section */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-10 w-10 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
