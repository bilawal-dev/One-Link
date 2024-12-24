import connectToDB from "@/lib/database/dbConnection";
import bitTreeModel from "@/lib/database/models/bitTreeModel";

export async function POST(request) {
    await connectToDB();

    const data = await request.formData();

    const handle = data.get('handle');
    const links = JSON.parse(data.get('links'));
    const pic = data.get('pic');
    const desc = data.get('desc');
    const userId = data.get('userId');

    //Because Form Data Can Only Return Data In Strings
    if(userId === 'undefined'){
        return Response.json({ success: false, error: true , message: 'Login To Claim Your Handle' });
    }

    //Validation
    if(!handle || !links || !pic || !desc){
        return Response.json({ success: false, error: true, message: 'Error! Incomplete Data' })
    }
    
    const bufferData = await pic.arrayBuffer();
    const buffer = Buffer.from(bufferData);
    
    const newBitTree = {
        handle,
        links,
        pic : {
            name: pic.name,
            data: buffer,
            contentType: pic.type,
        },
        desc,
        userId
    };
    
    const bitTree = await bitTreeModel.create(newBitTree);
    
    return Response.json({ success: true, error: false, message: 'Your BitTree Has Been Generated!', bitTree })
}