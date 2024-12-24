import connectToDB from '@/lib/database/dbConnection';
import bitTreeModel from '@/lib/database/models/bitTreeModel';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request, { params }) {
    const handle = (await params).handle;

    const session = await getServerSession(options);
    
    await connectToDB();
    
    const bitTree = await bitTreeModel.findOne({ handle });
    
    if (!bitTree) {
        return Response.json({ handleExists: false, message: 'BitTree With This Handle Does Not Exists!' })
    }

    if(bitTree.userId == session.user.id){
        return Response.json({ handleExists: false, message: 'This Is Your Current BitTree Handle' })
    }

    return Response.json({ handleExists: true, message: 'BitTree With This Handle Already Exists!' })
};