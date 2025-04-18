import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 300; // 5 minutes

// Set a higher limit for the API route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function POST(request: NextRequest) {
  try {
    const { figureName, outfit, facialExpression, colorScheme, gadgets = [], imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // First, use Vision API to analyze and describe the person in the image
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this person concisely focusing on physical appearance (hair style, color, facial features, body type). Keep it under 500 words. Focus only on objective visual characteristics that would be helpful for creating an action figure likeness."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              }
            }
          ]
        }
      ],
      max_tokens: 300,
    });

    const personDescription = visionResponse.choices[0]?.message.content || "";
    console.log("Person description:", personDescription);

    // Format gadgets for the prompt
    const gadgetsList = gadgets.length > 0
      ? gadgets.join(', ').toUpperCase()
      : "SMARTPHONE, COFFEE CUP, NOTEBOOK";

    // The improved prompt template with the person description and gadgets
    const prompt = `A professional product photo of one action figure in unopened retail packaging.
    GENERAL:
    - Do not hallucinate.
    - Do not add any additional elements to the image.
    - Follow the packaging design and layout instructions strictly.
    - Glossy plastic blister pack against cardboard backing
    - Highly realistic toy packaging photography with soft studio lighting
    - The visual style should match vintage action figure packaging.

    PACKAGING DESIGN & LAYOUT:
    - Dark outer border with a hang-hole cutout at the top
    - Large bold text at the top displays the name "${figureName.toUpperCase()}" right below the hang-hole cutout. The text should be in the same color as the figure. Make sure the text is readable and visible.
    - The figure occupies the left half of the package, posed in a standing position, wearing ${outfit}.
    - The figure is inside a blister pack, the color of the cardboard inside the package is ${colorScheme}, the color of the plastic is transparent
    - The color of the background behind the package is white, slightly textured
    - A smaller blister bubble on the right half contains 3 accessory items: ${gadgetsList}. The items should be visible and stacked on top of each other.

    FIGURE:
    - The action figure closely resembles the person with these features: ${personDescription}
    - The figure has a ${facialExpression} expression
    - The figure has a smooth, simplified plastic appearance

    The image should be a straight-on product shot with minimal shadows and no background.`;

    console.log("Final prompt:", prompt);

    // Call DALL-E 3 API to generate image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    // Return both the generated image URL and the person description
    return NextResponse.json({
      imageUrl: response.data[0].url,
      personDescription
    });
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
