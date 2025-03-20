import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ProjectCard({
  title,
  description,
  image,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden p-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 pr-8 text-lg mb-4 line-clamp-2">
        {description}
      </p>
      <div className="relative h-[500px] w-full">
        <Image
          src={"/conMayka.jpeg"}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
