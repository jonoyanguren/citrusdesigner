import { openai } from "@/lib/openai";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/users";
import { BlogPost } from "@prisma/client";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const prompt = `
You are a professional translator specializing in blog content.
Your task is to translate a blog post from Spanish to English while maintaining:
- Original formatting and style
- Technical accuracy
- SEO optimization
- Natural language flow

Input format (JSON):
{
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  metaTitle: string,
  metaDesc: string,
  keywords: string
}

Requirements:
1. Keep the slug in English
2. Maintain HTML formatting in content
3. Ensure metaTitle and metaDesc are SEO-friendly
4. Keywords should be relevant to English audience
5. Return valid JSON with the same structure
`;

const checkTranslatedPost = (post: BlogPost) => {
  return (
    post.slug &&
    post.content &&
    post.excerpt &&
    post.metaTitle &&
    post.metaDesc &&
    post.keywords
  );
};

export async function POST(req: Request) {
  const session = await verifyToken();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const { postId } = await req.json();
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        metaTitle: true,
        metaDesc: true,
        keywords: true,
        userId: true,
      },
    });

    if (!post?.userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const userPrompt = `Translate from Spanish to English:\n${JSON.stringify(
      post
    )}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No translation content received");

    const translatedPost = JSON.parse(content);

    if (!checkTranslatedPost(translatedPost)) {
      return Response.json(
        { error: "Invalid translation format" },
        { status: 500 }
      );
    }

    // Create the translated post in the database
    const newPost = await prisma.blogPost.create({
      data: {
        title: translatedPost.title,
        slug: translatedPost.slug,
        content: translatedPost.content,
        excerpt: translatedPost.excerpt,
        metaTitle: translatedPost.metaTitle,
        metaDesc: translatedPost.metaDesc,
        keywords: translatedPost.keywords,
        language: "EN",
        translatedId: post.id,
        translatedSlug: post.slug,
        user: {
          connect: {
            id: post.userId,
          },
        },
      },
    });

    // Update the original post
    await prisma.blogPost.update({
      where: { id: post.id },
      data: {
        translatedId: newPost.id,
        translatedSlug: translatedPost.slug,
      },
    });

    return Response.json({
      success: true,
      message: "Post translated successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Translation failed:", error);
    return Response.json(
      {
        error: "Translation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
