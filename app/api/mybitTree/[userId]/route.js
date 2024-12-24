import connectToDB from '@/lib/database/dbConnection';
import bitTreeModel from '@/lib/database/models/bitTreeModel';

export async function GET(request, { params }) {
    const userId = (await params).userId;

    await connectToDB();

    const bitTree = await bitTreeModel.findOne({ userId });

    // if (!bitTree) {
    //     return Response.json({ success: false, message: 'BitTree With This Handle Does Not Exists!', bitTree });
    // }

    return Response.json({ success: true, message: 'BitTree Retreived', bitTree });
};