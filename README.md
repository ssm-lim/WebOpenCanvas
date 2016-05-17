# WebOpenCanvas

## (2016.05.17)
### Problem
> When broswer refreshing, the socket connection is duplicated.

> Though a room is empty, the room isn't removed.

### Needed feature
> chat
>> Add people list.

> draggable
>> Upgrade event performance.

> canvas
>> Add layers.
>> Add paint.
>> Add downloading image in canvas.
>> Add feature whether keeping canvas after got out.
>> When one enter the room, canvas status of others have to be reflected in one's mirroring-canvas.


### Code

> draggable.js
>> $('#something').minimalize(selected);
>>> Something : Object to minimalize.

>>> Selected : Child object of Something that dbclick to minimalize. Only this object doesn't hide.

>> $('#something').draggable(selected);  
>>> Something : Object to drag.

>>> Selected : Child object of Something to drag. When dragging this object, Something is moved. 


> chat.js
>> Feature to chat.

> canvas.js
>> Feature to draw

> mirroring-canvas.js
>> Feature to draw other people's canvas over socket.io



### Demo

#### - Single Canvas
>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/single_01.png?raw=true)
>>1 Enter width, height of your canvas and press "start" button.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/single_02.png?raw=true)
>>2 Enjoy canvas!


#### - Multi Canvas
>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_01.png?raw=true)
>>1 Enter width, height of your canvas and press "start" button.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_02.png?raw=true)
>>2 Enter your name and press "confirm" button.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_03.png?raw=true)
>>3 You can chat and draw with someone and your room name is 'vw89B0J'.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_04.png?raw=true)
>>4 The other try to connect to room 'vw89B0J'.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_06.png?raw=true)
>>5 Someone enter the room.

>![alt tag](https://github.com/ssm-lim/WebOpenCanvas/blob/master/ImgForReadMe/party_09.png?raw=true)
>>6 Enjoy drawing and chatting.
