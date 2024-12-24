import connectToDB from '@/lib/database/dbConnection';
import bitTreeModel from '@/lib/database/models/bitTreeModel';

export async function GET(request, { params }) {
    const handle = (await params).handle;

    await connectToDB();

    const bitTree = await bitTreeModel.findOne({ handle });

    console.log(bitTree);
    console.log(typeof(bitTree));
    console.log(!bitTree)
    
    if (!bitTree) {
        console.log('True');
        return Response.json({ handleExists: false, message: 'BitTree With This Handle Does Not Exists!', bitTree })
    }

    return Response.json({ handleExists: true, message: 'BitTree With This Handle Already Exists!', bitTree })
}