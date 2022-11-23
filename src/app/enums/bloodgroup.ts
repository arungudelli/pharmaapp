import { GenericData } from 'src/app/models/genericdata';

var bgs =["A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"];

var genericBloodGrp : GenericData[] = [];

for(let i=0;i<bgs.length;i++){
    genericBloodGrp.push({Name:bgs[i],Value:i});
}


export const BloodGroup = genericBloodGrp;