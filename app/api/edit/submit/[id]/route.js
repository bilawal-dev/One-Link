import connectToDB from "@/lib/database/dbConnection";
import bitTreeModel from "@/lib/database/models/bitTreeModel";

export async function PATCH(request, { params }) {

    await connectToDB();
    console.log('PATCH REQUEST HIT');
    const id = (await params).id;

    const data = await request.formData();

    const handle = data.get('handle');
    const links = JSON.parse(data.get('links'));
    const isNewPic = JSON.parse(data.get('isNewPic')); // It Sends the isNewPic As Strings 'True' And 'False', So We Parese Them Into Booleans
    let pic;
    if (isNewPic) {
        pic = data.get('pic');
    }
    else {
        pic = JSON.parse(data.get('pic'));
    }
    const desc = data.get('desc');

    let newBitTree;
    
    console.log('isNewPic : ', typeof(isNewPic));

    //If Picture Is Already In Buffer Form, Mean User Has Not Changed The Image 
    if (isNewPic) {
        const bufferData = await pic.arrayBuffer();
        const buffer = Buffer.from(bufferData);

        newBitTree = {
            handle,
            links,
            pic: {
                name: pic.name,
                data: buffer,
                contentType: pic.type,
            },
            desc,
        };
    }
    else {
        newBitTree = {
            handle,
            links,
            desc,
        };
    }

    const bitTree = await bitTreeModel.findByIdAndUpdate(id, newBitTree, { new: true });

    if (!bitTree) {
        return Response.json({ success: false, error: true, message: 'Failed To Edit BitTree!', bitTree })
    }

    return Response.json({ success: true, error: false, message: 'Your BitTree Has Been Updated!', bitTree })
}