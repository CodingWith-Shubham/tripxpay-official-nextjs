import { NextRequest, NextResponse } from 'next/server';
import { 
  uploadDocuments, 
  getUserInfo, 
  getAllUsers, 
  uploadMerchantDocuments, 
  deleteUserInfo 
} from '@/lib/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'uploadDocuments':
        const result = await uploadDocuments(
          data.displayName,
          data.email,
          data.photoUrl,
          data.uid,
          data.msmeCertificate,
          data.gstCertificate,
          data.faceImage,
          data.isEmailVerified,
          data.address,
          data.profilePicture,
          data.phoneNumber,
          data.profession,
          data.fatherName,
          data.merchantRel
        );
        return NextResponse.json(result);

      case 'uploadMerchantDocuments':
        const merchantResult = await uploadMerchantDocuments(
          data.displayName,
          data.email,
          data.photoUrl,
          data.uid,
          data.msmeCertificate,
          data.gstCertificate,
          data.isEmailVerified,
          data.address,
          data.profilePicture,
          data.phoneNumber,
          data.companyName
        );
        return NextResponse.json(merchantResult);

      case 'deleteUserInfo':
        const deleteResult = await deleteUserInfo(data.uid);
        return NextResponse.json(deleteResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const uid = searchParams.get('uid');

    switch (action) {
      case 'getUserInfo':
        if (!uid) {
          return NextResponse.json(
            { error: 'UID is required' },
            { status: 400 }
          );
        }
        const userInfo = await getUserInfo(uid);
        return NextResponse.json(userInfo);

      case 'getAllUsers':
        const allUsers = await getAllUsers();
        return NextResponse.json(allUsers);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 