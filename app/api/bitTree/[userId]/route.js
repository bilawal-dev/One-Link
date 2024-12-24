import connectToDB from '@/lib/database/dbConnection';
import bitTreeModel from '@/lib/database/models/bitTreeModel';

export async function GET(request, { params }) {
    const userId = (await params).userId;

    await connectToDB();

    const bitTree = await bitTreeModel.findOne({ userId });
    
    if (!bitTree) {
        return Response.json({ linkTreeExists: false, linkTree: bitTree, message: 'Your BitTree Does Not Exists!' })
    }

    return Response.json({ linkTreeExists: true, linkTree: bitTree, message: 'Your BitTree Exists!' })
}