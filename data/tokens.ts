import {v4 as uuidv4} from 'uuid'

import { db } from '@/lib/db';
import {getVerificationTokenByEmail}  from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from './paswordResetToken';

export const generatePasswordResetToken = async (email:string )=>{
    const token= uuidv4()
    const expires = new Date(new Date().getTime()+ 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    if (existingToken){
        await db.passwordResetToken.delete({
            where:{ id:existingToken.id}
        })
    }
    // console.log("Creating Password Reset Token:", { email, token, expires });
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
        
    })
    // console.log("Created Password Reset Token:", passwordResetToken);

    return passwordResetToken
}

export default  async function generateVerificationToken(email:string) {
const token = uuidv4();
const expires = new Date(new Date().getTime()+3600 *1000);

const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.verificationToken.delete({
            where:{
                id:existingToken.id
            },
        });
    }


const verificatonToken = await db.verificationToken.create({
    data:{
        email,
        token,
        expires,
    }
})

return verificatonToken
}

