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
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
