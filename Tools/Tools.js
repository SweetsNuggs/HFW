
const randomNum = async function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

const resolveChannel = async function(search, guild){
    let channel = null;
    if(!search || typeof search !== 'string') return;
    if(search.match(/^#&!?(\d+)$/)){
        let id = search.match(/^#&!?(\d+)$/)[1];
        channel = guild.channels.cache.get(id);
        if(channel) return channel;
    }
    if(search.includes("<#")){
        let firstChannel = search.replace("<#", "");
        let channelID = firstChannel.replace(">", "");
        let channel = guild.channels.cache.get(channelID)
        if(channel) return channel;
    }
    channel = guild.channels.cache.find((c) => search.toLowerCase() === c.name.toLowerCase());
    if(channel) return channel;

    channel = guild.channels.cache.get(search);
    return channel;
}
const resolveMember = async function(search, guild){
    let member = null;
    if(!search || typeof search !== 'string') return;
    if(search.match(/^<@!?(\d+)>$/)){
        const id = search.match(/^<@!?(\d+)>$/)[1];
        member = await guild.members.fetch(id).catch(() => {});
        if(member) return member;
    }
    if(search.match(/^!?(\w+)#(\d+)$/)){
        guild = await guild.fetch();
        member = guild.members.cache.find((m) => m.user.tag === search);
        if(!member){
            member = guild.members.fetch({cache: true}).then(m=>m.find(m=>m.user.tag.toLowerCase() === search.toLowerCase()));
        }
        if(member) return member;
    }
    member = await guild.members.fetch(search).catch(() => {});
    return member;
}

const resolveRole = async function(search, guild){
    let role = [];
    if(!search || typeof search !== 'string') return;
    if(search.match(/^<@&(\d+)>$/)){
        const id = search.match(/^<@&(\d+)>$/)[1];
        role = await guild.roles.fetch(id).catch(() => {});
        if(role) return role;
      }
    role = await guild.roles.fetch(search).catch(() => {});
    return role
}

const resolveUser = async function(search) {
    let user = null;
    if(!search || typeof search !== 'string') return;
    if(search.match(/^<@!?(\d+)>$/)){
        const id = search.match(/^<@!?(\d+)>$/)[1];
        user = this.users.fetch((u) => u.username === username && u.discriminator === discriminator )
        if (user) return user;
    }
    user = await client.users.fetch(search).catch(() => {});
    return user;
}

const getCaseNumber = async function(client, guild, modLog){
    const message = (await modLog.messages.fetch({limit: 100})).filter(m => m.member === guild.me &&
        m.embeds[0] &&
        m.embeds[0].type == 'rich' &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text && 
        m.embeds[0].footer.text.startsWith('Case')
        ).first()
    if(message){
        const footer = message.embeds[0].footer.text;
        const num = parseInt(footer.split('#').pop());
        if(!isNaN(num)) return num + 1;
    }
    return 1
}

const getOrdinalSuffix = function(i) {
    var j = i %10
    k = i % 100
    if(j == 1 && k != 11){
        return i + 'st';
    }
    if(j == 2 && k != 12){
        return i + 'nd'
    }
    if(j == 3 && k != 13){
        return i +'rd'
    }
    return i + 'th'
}

const shuffle = function(pArray){
    const array = []
    pArray.forEach(element => array.push(element));
    let currentIndex = array.length, temporaryValue, randomIndex;
    while(0 !== currentIndex){
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1;
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue
    }
    return array;
}

const shuffles = function(content){
    var a = content.split("");
    n = a.length;
    for(var i = n -1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a [i];
        a[i] = a[j];
        a[j] = tmp
    }
    return a.join('')
}

const fromNow = async function(date){
    if (!date) {
        return false;
    }
    const ms = new Date().getTime() - date.getTime();
    if (ms >= 86400000) {
        const days = Math.floor(ms / 86400000);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    return `${client.tools.humanizeDuration(ms, 1, false, false)} ago`;
  }
const humanizeDuration = async function(ms, maxUnits, short = false, fraction = true){
    const round = ms > 0 ? Math.floor : Math.ceil
    const parsed = [{
      int: round(ms / 604800000),
      sin: 'week',
      plu: 'weeks',
      sho: 'w'
  },
  {
      int: round(ms / 86400000) % 7,
      sin: 'day',
      plu: 'days',
      sho: 'd'
  },
  {
      int: round(ms / 3600000) % 24,
      sin: 'hour',
      plu: 'hours',
      sho: 'h'
  },
  {
      int: round(ms / 60000) % 60,
      sin: 'minute',
      plu: 'minutes',
      sho: 'm'
  },
  {
      int: (round(ms / 1000) % 60) + (round(ms) % 1000 / 1000),
      sin: 'second',
      plu: 'seconds',
      sho: 's'
  }
  ]
  
  const result = []
  for (let i = 0; i < parsed.length; i++){
    if(!result.length && parsed[i].int === 0){
      continue
    }
    if(result.length >= maxUnits){
      break
    }
    let int = parsed[i].int
    if(!result.length && fraction && i === parsed.length - 1){
      int = int.toFixed(1)
    } else {
      int = int.toFixed(0)
    }
  
    result.push(`${int}${short ? parsed[i].sho : ' ' +  (parseFloat(int) !== 1 ? parsed[i].plu : parsed[i].sin)}`)
  }
  return result.map((res, i) => {
    if(!short){
      if(i === result.length - 2){
        return res + ' and'
      } else if (i !== result.length - 1){
        return res + ','
      }
    }
    return res
  }).join(' ')
  }
  const convertTime = async function(date){
    const milliseconds = new Date().getTime() - date.getTime()
    let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    let years = Math.abs(roundTowardsZero(milliseconds / 3.154e+10)),
    months = Math.abs(roundTowardsZero(milliseconds / 2.6280E+9) % 12),
    weeks = Math.abs(roundTowardsZero(milliseconds / 6.048e+8) % 4),
    days = Math.abs(roundTowardsZero(milliseconds / 8.64e+7) % 7),
    hours = Math.abs(roundTowardsZero(milliseconds / 3600000) % 24),
    mins = Math.abs(roundTowardsZero(milliseconds / 60000) % 60),
    secs = Math.abs(roundTowardsZero(milliseconds / 1000) % 60);
    if(secs === 0){
        secs++;
    }
    let laDays = days > 0,
    laYears = years > 0,
    laMonths = months > 0,
    laWeeks = weeks > 0,
    laHours = hours > 0,
    laMinutes = mins > 0;
    let pattern =
    (!laYears ? "" : (laMinutes || laHours || laDays || laWeeks|| laMonths) ? "{years} years, " : "{years} years &")+
    (!laMonths ? "" : (laMinutes || laHours || laDays || laWeeks) ? "{months} months, " : "{months} months & ")+
    (!laWeeks ? "" : (laMinutes || laHours|| laDays) ? "{weeks} weeks, " : "{weeks} weeks & ")+
    (!laDays ? "" : (laMinutes || laHours) ? "{days} days, " : "{days} days & ")+
    (!laHours ? "" : (laMinutes) ? "{hours} hours, " : "{hours} hours & ")+
    (!laMinutes ? "" : "{mins} mins, ")+
    (" {secs} seconds");
    let sentence = pattern
    .replace("{duration}", pattern)
    .replace("{years}", years)
    .replace("{months}", months)
    .replace("{weeks}", weeks)
    .replace("{days}", days)
    .replace("{hours}", hours)
    .replace("{mins}", mins)
    .replace("{secs}", secs);
    return sentence;

};

module.exports = {
    randomNum,
    resolveChannel,
    resolveMember,
    resolveRole,
    resolveUser,
    getCaseNumber,
    getOrdinalSuffix,
    shuffle,
    shuffles,
    fromNow,
    humanizeDuration,
    convertTime
}