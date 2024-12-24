import connectToDB from '@/lib/database/dbConnection';
import bitTreeModel from '@/lib/database/models/bitTreeModel';

export async function GET(request, { params }) {
    const userId = (await params).userId;
    
    await connectToDB();

    const bitTree = await bitTreeModel.findOne({ userId });

    if (!bitTree) {
        return Response.json({ success: false, message: "Currently You Don't Have Any BitTree, Proceed To Create One", bitTree });
    }

    return Response.json({ success: true, message: 'Your BitTree Retreived', bitTree });
};