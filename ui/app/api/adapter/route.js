import { NextResponse } from 'next/server';

export async function POST(request) {
  // Get form data from request
  const formData = await request.json();
  console.log('Request data received first try is: ', formData.data);
  const inputData = formData.data;
  console.log('Request data received: ', inputData.original, inputData.redeem);

  try {
    let response = await fetch(process.env.VOICE_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        original: formData.data.original,
        redeeming: formData.data.redeem
      })
    });
    response = await response.json();
    console.log('Api response is: ', response);
    return NextResponse.json({
      data: {
        result: response.verified
      }
    });
  } catch (error) {
    console.error('Api response error: ', error);
    return NextResponse.json({
      data: {
        result: false
      }
    });
  }
}
