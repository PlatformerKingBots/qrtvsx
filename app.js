//NDg2NTUyMTcxODE1NTAxODI0.DnAwow.tD-uNBcRaUvhQMRYHMxZ7j0TWTc

const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const prefix = "!"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

var success = "<:success:376138120032288780>";
var error = "<:error:376138218632118283>";

var genTime = function(t) {
    let num = 0;
    let n = parseInt(t.slice(0, t.length - 1));
    let l = t[t.length - 1];
    switch (l) {
        case "s":
            num = n * 1000;
            break;
        case "m":
            num = n * 60000;
            break;
        case "h":
            num = n * 3600000;
            break;
    }

    return num;
};
var constrain = function(num, min, max) {
    num = Math.min(Math.max(parseInt(num), min), max);
    return num;
};

var replaceDaSpace = function(m) {
    for (var i = 0; i < m.length; i++) {
        if (m[i] === " ") {
            m[i] = "-";
        }
    }
    return m;
};

var intt;

var blocked = [
    //spy
    '486551104440631299',
    '486551083020189698',

    //staff
    '486551264642072587',
    '486551238931120128',
    '486551451439464450',
    '486551282828574728',

    //info
    '486549704176435220',
    '486553417880305675',
    '486549837395787787',
    '486550238149214208',
    '486582258522652688',
];

const welcome = new Discord.WebhookClient('541082847490998272', 'ITVsSUEt8B3PWhwaoofpSGBz_6OCu6P6Sr-_mzkce1_Euy0dNufKxeRLkfsBcLY1SA66');
client.on('guildMemberAdd', member => {
    //member.guild.channels.get("486553417880305675").send(`Welcome to The KA Server Monitor Server, ${member}!`);//507570286833565696
    welcome.send(`Welcome to The KA Monitors Server, ${member}!`);
    member.guild.channels.get('541082354542706719').send({
        embed: {
            title: `Member Joined`,
            description: `${member} (${member.user.tag})`,
            color: 0xf8333c,
        }
    });
}); //Invite

client.on('message', message => {
    let args = message.content.split(" ").splice(1);
    let args2 = (args.join(" ")).split(" | ");
    var m = message.content.toLowerCase();
    var s = function(sa) {
        return m.startsWith(prefix + sa);
    };

    if ((s("clear")) && (message.member.hasPermission('MANAGE_MESSAGES'))) {
        // gud = true;
        try {
            message.channel.bulkDelete(constrain(args[0], 2, 100));
            message.channel.send(":ok_hand: I have deleted " + constrain(args[0], 1, 100) + " messages.").then(msg => {
                setTimeout(function() {
                    msg.delete(50);
                }, 3000);
            });
            message.client.channels.get('541082354542706719').send({
                embed: {
                    title: 'Bulk Delete',
                    description: `Bulk delete of ${constrain(args[0], 2, 100)} messages in <#${message.channel.id}> by ${message.member}`,
                    footer: {
                        timestamp: new Date(),
                    },
                    color: 0xf8333c,
                }
            });
        }
        catch (error) {
            /*gud = false;
            console.log(error);*/
            message.channel.send("ERROR\n" + error);
        }
    }
    if (s("softban") && message.member.hasPermission('KICK_MEMBERS')) {
        try {
            let member = message.mentions.members.first();
            let user = message.mentions.users.first();
            let reason = args.slice(1).join(" ");
            if (message.member.hasPermission("BAN_MEMBERS")) {
                if (message.mentions.members.size !== 0) {
                    if (!reason) { reason = "No reason provided" }
                    member.ban({ days: 7, reason: reason });
                    message.guild.unban(user.id);
                    message.channel.send(`${success} | ${member} was softbanned successfully`);
                    message.client.channels.get('541082354542706719').send({
                        embed: {
                            title: 'Member Softbanned!',
                            description: `${member} (${member.tag}) was softbanned by ${message.member}`,
                            footer: {
                                timestamp: new Date(),
                            },
                            color: 0xf8333c,
                        }
                    });
                }
                else {
                    message.channel.send(`${error} | Please state a valid user.`);
                }
            }
            else {
                message.channel.send(`${error} | You don't have permission to use this command.`);
            }
        }
        catch (e) {
            message.channel.send(`${error} | Something went wrong, please try again.`);
        }
    }
    if (s("ban") && message.member.hasPermission('BAN_MEMBERS')) {
        try {
            let member = message.mentions.members.first();
            let reason = args.slice(1).join(" ");
            if (message.member.hasPermission("BAN_MEMBERS")) {
                if (message.mentions.members.size !== 0) {
                    if (!reason) { reason = "No reason provided" }
                    member.ban({ days: 7, reason: reason });
                    message.channel.send(`${success} | ${member} was banned successfully`);
                    message.client.channels.get('541082354542706719').send({
                        embed: {
                            title: 'Member Banned!',
                            description: `${member} (${member.tag}) was banned by ${message.member}`,
                            footer: {
                                timestamp: new Date(),
                            },
                            color: 0xf8333c,
                        }
                    });
                }
                else {
                    message.channel.send(`${error} | Please state a valid user.`);
                }
            }
            else {
                message.channel.send(`${error} | You don't have permission to use this command.`);
            }
        }
        catch (e) {
            message.channel.send(`${error} | Something went wrong, please try again.`);
        }
    }
    if (s("mute") && message.member.hasPermission('MANAGE_ROLES')) {
        if (message.member.hasPermission("MANAGE_ROLES")) {
            let member = message.mentions.members.first();
            if (!message.guild.roles.find("name", "Muted")) {
                message.guild.createRole({
                    name: 'Muted',
                    permissions: ["READ_MESSAGES", "READ_MESSAGE_HISTORY"]
                }).then((role) => {
                    member.addRole(role.id);
                    message.channel.send(`${success} | Role "Muted" was created, and ${member} was muted successfully.`);
                    setTimeout(function() {
                        member.removeRole(role.id);
                    }, genTime(args[1]));
                    message.client.channels.get('541082354542706719').send({
                        embed: {
                            title: 'Member Muted!',
                            description: `${member} (${member.tag}) was muted by ${message.member} for ${args[1]}`,
                            footer: {
                                timestamp: new Date(),
                            },
                            color: 0xf8333c,
                        }
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
            else {
                let mutedRole = message.guild.roles.find("name", "Muted");
                member.addRole(mutedRole.id);
                message.channel.send(`${success} | ${member} was muted successfully.`);
                setTimeout(function() {
                    member.removeRole(mutedRole.id);
                }, genTime(args[1]));
            }
        }
        else {
            message.channel.send(`${error} | You don't have permission to use this command.`)
        }
    }
    if (s("warn") && message.member.hasPermission('KICK_MEMBERS')) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            let member = message.mentions.members.first();
            let reason = args.slice(1).join(" ");
            if (message.mentions.members.size !== 0) {
                if (!reason) return message.channel.send(`${error} | Please provide a reason.`);
                message.delete(50);
                member.send(`You were warned in **${message.guild.name}** for:\n${reason}`);
                message.channel.send(`${success} | ${member} was warned successfully`).then(msg => {
                    setTimeout(function() {
                        msg.delete(50);
                    }, 3000)
                });
                message.client.channels.get('541082354542706719').send({
                    embed: {
                        title: 'Member Warned!',
                        description: `${member} (${member.tag}) was warned by ${message.member}\n\n\`${reason}\``,
                        footer: {
                            timestamp: new Date(),
                        },
                        color: 0x319292,
                    }
                });
            }
            else {
                message.channel.send(`${error} | Please state a valid user.`);
            }
        }
        else {
            message.channel.send(`${error} | You don't have permission to use this command.`);
        }
    }
    if (s("kick") && message.member.hasPermission('KICK_MEMBERS')) {
        try {
            if (message.member.hasPermission("KICK_MEMBERS")) {
                message.delete(1);
                if (message.mentions.members.size !== 0) {
                    let member = message.mentions.members.first();
                    let reason = args.slice(1).join(" ");
                    member.kick(reason);
                    message.channel.send(`${success} | ${member} was kicked successfully`);
                    message.client.channels.get('541082354542706719').send({
                        embed: {
                            title: 'Member Kicked!',
                            description: `${member} (${member.tag}) was kicked by ${message.member}`,
                            footer: {
                                timestamp: new Date(),
                            },
                            color: 0x319292,
                        }
                    });
                }
                else {
                    message.channel.send(`${error} | Please state a valid user.`);
                }
            }
            else {
                message.channel.send(`${error} | You don't have permission to use this command.`);
            }
        }
        catch (e) {
            message.channel.send(`${error} | Something went wrong, please try again.`);
        }
    }

    if (message.content.startsWith('poll:')) {
        message.react('👍');
        message.react('👎');
        message.react('🤷');
    }
    if (message.content.startsWith('Poll:')) {
        var m = message.content.split('Poll:');
        message.delete(50);
        message.channel.send({
            embed: {
                title: 'Poll',
                color: 0xf8333c,
                description: m[1],
                footer: {
                    text: `Poll by ${message.author.tag}`
                }
            }
        }).then(msg => {
            msg.react('👍');
            msg.react('👎');
            msg.react('🤷');
        });
    }
    if (message.content.startsWith(prefix + 'announce')) {
        var m = args.join(' ');
        message.delete(50);
        message.channel.send({
            embed: {
                title: 'Announcement',
                color: 0xf8333c,
                description: m,
            }
        });
    }
}); //Message

client.login(process.env.token);
