

function apiInteraction(HTTPMethod,url){
    return new Promise((resolve,reject)=>{
        let request=new XMLHttpRequest();
        request.open(HTTPMethod,url);
        request.responseType='json';
        request.onload=()=>{
            if(request.status==200){
                resolve(request.response);
            }else{
                reject(request.response);
            }
        }
        request.send();
    })
}

/*
apiInteraction('GET','https://utn-lubnan-api-2.herokuapp.com/api/student')
    .then((response)=>{
        //console.log(response);
        //orderData(response);
    })
    .catch((reason)=>{
        console.log(reason);
    })
*/
//Muestra todos los estudiantes teniendo en cuenta si se encuentran anotados en una carrera y si la misma esta activa o no
//(solo muestra los que cumplan con ambas condiciones)
//los muestra ordenados por apellido
async function addStudentsToTable(){
    let students=await apiInteraction('GET','https://utn-lubnan-api-2.herokuapp.com/api/student');
    let careers=await apiInteraction('GET','https://utn-lubnan-api-2.herokuapp.com/api/Career');
    fillTable(orderData(students),careers);
}

function fillTable(students,careers){
    let tableBody=document.getElementById('tabBody');
    students.forEach(student => {
        if(student.careerId!=null && careers[student.careerId-1].active==true){
        tableBody.innerHTML+=`
        <tr id="student${student.studentId}">
                <th scope="row">${student.studentId}</th>
                <td>${careers[student.careerId-1].name}</td>
                <td>${student.lastName}</td>
                <td>${student.firstName}</td>                
                <td>${student.email}</td>
                <td><button type="button" class="btn btn-danger btn-sm" onclick="deleteStudent(${student.studentId})" >Delete</button></td>
        </tr>
        `
        }
    });
}

addStudentsToTable();

//elmina el alumno de la tabla presionando el boton que se encuentra en la fila de dicho alumno
function deleteStudent(userId){
    apiInteraction('DELETE','https://utn-lubnan-api-2.herokuapp.com/api/student/'+userId)
    .then((response)=>{
        console.log('succesfully deleted');
        deleteFromTable(userId);
    })
    .catch((reason)=>{
        console.log(reason);
    })
}

function deleteFromTable(userId){
    let id='student'+userId;
    let row=document.getElementById(id);
    row.remove();
}


//orderna los datos y los devuelve para mostrarlo ordenado usando el algoritmo de ordenamiento por busqueda por seleccion, no es el mas 
//optimo pero es lo que me acorde
function orderData(students){
    let i=0,j=0;
    let lower=0;
    let aux;
    while(i<students.length){
        while(j<students.length){
            if(students[j].lastName<students[lower].lastName){
                lower=j;
            }
            j++;
        }
        aux=students[i];
        students[i]=students[lower];
        students[lower]=aux;
        i++;
        j=i;
    }
    return students;
}



