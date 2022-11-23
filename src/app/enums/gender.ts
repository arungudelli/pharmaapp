import { GenericData } from 'src/app/models/genericdata';

var genders =['Male','Female','Other'];

var gs : GenericData[] = [];

for(let i=0;i<genders.length;i++){
    gs.push({Name:genders[i],Value:i});
}


export const Gender = gs;