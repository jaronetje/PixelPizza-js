const{createEmbed,sendEmbed}=require("../functions");
const{query}=require("../dbfunctions");
const{blue,red}=require('../colors.json');
const{statuses}=require('../config.json');

module.exports={
    name:"orders",
    description:"show all orders",
    minArgs:0,
    usage:"<status>",
    cooldown:0,
    userType:"worker",
    pponly:false,
    async execute(message,args,client){
        let status;
        let embedMsg=createEmbed(blue,`**${this.name}**`);
        let results;
        if(args.length){
            status=args.join(" ");
        }
        if(!args.length){
            results=await query("SELECT * FROM `order` WHERE status NOT IN('deleted','delivered')");
        } else if(!statuses.includes(status)){
            embedMsg.setColor(red).setDescription(`${status} is not a valid status`).addField("Statuses",statuses.join(", "));
            if(!client.canSendEmbeds)embedMsg=`${embedMsg.description}\n\n${embedMsg.fields[0].name}\n${embedMsg.fields[0].value}`;
            return message.channel.send(embedMsg);
        } else {
            results=await query("SELECT * FROM `order` WHERE status = ?",[status]);
        }
        let ordersString=results.length?"\`":"no orders have been found";
        for(let i in results){
            let result=results[i];
            ordersString+=result.orderId;
            if(i==results.length-1){
                ordersString+="\`";
            }else{
                ordersString+=", ";
            }
        }
        embedMsg.setDescription(ordersString);
        return sendEmbed(embedMsg,message);
    }
}