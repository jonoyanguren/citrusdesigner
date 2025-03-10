interface FeatureItemProps {
  title: string;
}

export default function FeatureItem({ title }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-4 px-6 shrink-0">
      <div className="h-2 w-2 rounded-full bg-white" />
      <h3 className="text-2xl font-semibold text-white whitespace-nowrap">
        {title}
      </h3>
    </div>
  );
}
