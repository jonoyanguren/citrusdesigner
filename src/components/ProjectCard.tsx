import Image from "next/image";

interface ProjectTag {
  id: string;
  name: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: ProjectTag[];
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden p-4">
      <div className="relative h-[234px] w-full">
        <Image
          src={"/conMayka.jpeg"}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="pt-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-4 py-1 bg-white border border-gray-900 text-sm rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
