#include <iostream>
#include <string>
#include <pqxx/pqxx>
using namespace std;
using namespace pqxx;

void insereAdministrador(string Adm_Nome, string Adm_Senha, string Adm_Data, string Adm_Email) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database" << endl;
            return;

        }

        s = "INSERT INTO Administradores (Adm_Nome, Adm_Senha, Adm_Nascimento, Adm_Email) VALUES ( '"+ Adm_Nome +"', MD5('" + Adm_Senha +"'), '" + Adm_Data + "', '" + Adm_Email + "');";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Administrador inserted successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

void removeAdministrador(string Adm_Nome) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return;

        }

        s = "UPDATE Administradores SET Adm_Ativo = FALSE WHERE Adm_Nome = '"+ Adm_Nome +"';";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Administrador removed successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

void insereFuncionario(string Fun_Nome, string Fun_Senha, string Fun_Data, string Fun_Email) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database" << endl;
            return;

        }

        s = "INSERT INTO Funcionarios (Fun_Nome, Fun_Senha, Fun_Nascimento, Fun_Email) VALUES ( '"+ Fun_Nome +"', MD5('" + Fun_Senha + "'), '" + Fun_Data + "', '" + Fun_Email + "');";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Funcionario inserted successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

void removeFuncionario(string Fun_Nome) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return;

        }

        s = "UPDATE Funcionarios SET Fun_Ativo = FALSE WHERE Fun_Nome = '"+ Fun_Nome +"';";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Funcionario removed successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

void insereVeterinario(string Vet_Nome, string Vet_Senha, string Vet_Data, string Vet_Email) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database" << endl;
            return;

        }

        s = "INSERT INTO Veterinarios (Vet_Nome, Vet_Senha, Vet_Nascimento, Vet_Email) VALUES ( '"+ Vet_Nome +"', MD5('" + Vet_Senha + "'), '" + Vet_Data + "', '" + Vet_Email + "');";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Veterinario inserted successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

void removeVeterinario(string Vet_Nome) {

    const char * sql;
    string s;

    try{

        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return;

        }

        s = "UPDATE Veterinarios SET Vet_Ativo = FALSE WHERE Vet_Nome = '"+ Vet_Nome +"';";
        sql = s.c_str();


        /* Create a transactional object. */
        work W(C); 

        W.exec( sql );
        W.commit();

        cout << "Veterinario removed successfully" << endl;

        //C.disconnect();

        return;

    
    }catch (const std::exception &e){

        cerr << e.what() << std::endl;

        return;

    }

}

bool loginAdministrador(const string &Adm_Nome, const string &Adm_Senha) {
    try {
        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return false;

        }

        C.prepare("check_admin",
                  "SELECT COUNT(*) FROM Administradores "
                  "WHERE Adm_Ativo = TRUE AND Adm_Senha = MD5($1) AND Adm_Nome = $2");

        work W(C);

        result r = W.exec_prepared("check_admin", Adm_Senha, Adm_Nome);

        int count = 0;
        if (!r.empty())
            count = r[0][0].as<int>();

        W.commit();
        return (count > 0);
    }
    catch (const std::exception &e) {
        
        return false;

    }
}

bool loginFuncionario(const string &Fun_Nome, const string &Fun_Senha) {
    try {
        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return false;

        }

        C.prepare("check_admin",
                  "SELECT COUNT(*) FROM Funcionarios "
                  "WHERE Fun_Ativo = TRUE AND Fun_Senha = MD5($1) AND Fun_Nome = $2");

        work W(C);

        result r = W.exec_prepared("check_admin", Fun_Senha, Fun_Nome);

        int count = 0;
        if (!r.empty())
            count = r[0][0].as<int>();

        W.commit();
        return (count > 0);
    }
    catch (const std::exception &e) {
        
        return false;

    }
}

bool loginVeterinario(const string &Vet_Nome, const string &Vet_Senha) {
    try {
        connection C("dbname=banco user=postgres password=postgres hostaddr=127.0.0.1 port=5432");

        if (C.is_open()) {

            cout << "Opened database successfully! " << C.dbname() << endl;

        } else {

            cout << "Can't open database..." << endl;
            return false;

        }

        C.prepare("check_admin",
                  "SELECT COUNT(*) FROM veterinarios "
                  "WHERE Vet_Ativo = TRUE AND Vet_Senha = MD5($1) AND Vet_Nome = $2");

        work W(C);

        result r = W.exec_prepared("check_admin", Vet_Senha, Vet_Nome);

        int count = 0;
        if (!r.empty())
            count = r[0][0].as<int>();

        W.commit();
        return (count > 0);
    }
    catch (const std::exception &e) {
        
        return false;

    }
}


int main() {

    insereAdministrador("Aeronautics Barata", "WLEF7YTE", "2001-11-01", "AeronauticsBarata@tuta.io");
    insereAdministrador("Otávio Bundasseca", "dafg87yfpq", "1978-07-13", "otaviozinho123o@yahoo.com.br");
    insereAdministrador("Ilegível Inilegível", "XQEW3OI8UR45FH", "1964-03-31", "inelegivelInelegivel@tw1tt3r.com.us");
    removeAdministrador("Aeronautics Barata");
    //a remoção de um administrador não apaga o registro;

    insereFuncionario("Lança Perfume Rodometálico de Andrade", "defvcetrdf6584r", "2011-11-03", "lancadorzinho@outlook.com");
    insereFuncionario("Maria Privada de Jesus", "987fv78d", "1999-04-19", "mariaprivada@gmail.com");
    insereFuncionario("Bandeirante do Brasil Paulistano", "erfdókpfe894", "1950-07-26", "paulistanobrasil@yahoo.com");
    removeFuncionario("Lança Perfume Rodometálico de Andrade");
    //a remoção de um funcionário não apaga o registro;

    insereVeterinario("Antonio Manso Pacífico de Oliveira Sossegado", "fedrewd23", "1871-02-28", "antonio@yahoo.com");
    insereVeterinario("Dolores Fuertes de Barriga", "juyu77urtfg", "1977-01-16", "dolores@yahoo.com");
    insereVeterinario("Baleira Dorra", "gtrf434r5ujyh", "1958-11-05", "baleira@yahoo.com");
    removeVeterinario("Antonio Manso Pacífico de Oliveira Sossegado");
    //a remoção de um veterinário não apaga o registro;

    cout << endl;

    cout << loginAdministrador("Aeronautics Barata", "WLEF7YTE") << endl;
    cout << loginFuncionario("Maria Privada de Jesus", "987fv78d") << endl;
    cout << loginVeterinario("Baleira Dorra", "gtrf434r5ujyh") << endl;

    return 0;

}