import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'school-admin', 'teacher', 'accountant', 'staff', 'user', 'parent', 'student');
  CREATE TYPE "public"."enum_users_tenants_roles" AS ENUM('tenant-admin', 'tenant-viewer');
  CREATE TYPE "public"."enum_tenants_school_type" AS ENUM('primary', 'secondary', 'mixed');
  CREATE TYPE "public"."enum_academic_levels_academic_system" AS ENUM('EIGHT_FOUR_FOUR', 'CBC');
  CREATE TYPE "public"."enum_subjects_844_category" AS ENUM('MATHEMATICS', 'SCIENCES', 'LANGUAGES', 'HUMANITIES', 'TECHNICAL', 'BUSINESS', 'CREATIVE_ARTS', 'RELIGIOUS_STUDIES', 'PHYSICAL_EDUCATION');
  CREATE TYPE "public"."enum_teachers_gender" AS ENUM('MALE', 'FEMALE');
  CREATE TYPE "public"."enum_teachers_status" AS ENUM('ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED', 'RETIRED', 'PROBATION');
  CREATE TYPE "public"."enum_teachers_employment_type" AS ENUM('PERMANENT', 'CONTRACT', 'PART_TIME', 'INTERN', 'PROBATION', 'CASUAL');
  CREATE TYPE "public"."enum_classes_academic_system" AS ENUM('EIGHT_FOUR_FOUR', 'CBC');
  CREATE TYPE "public"."enum_students_gender" AS ENUM('MALE', 'FEMALE');
  CREATE TYPE "public"."enum_students_status" AS ENUM('ACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED', 'DROPPED_OUT', 'EXPELLED', 'REPEATING', 'DISCONTINUED', 'ON_LEAVE');
  CREATE TYPE "public"."enum_students_boarding_status" AS ENUM('DAY_SCHOLAR', 'BOARDER', 'WEEKLY_BOARDER');
  CREATE TYPE "public"."enum_parents_parent_relationship" AS ENUM('FATHER', 'MOTHER', 'RELATIVE', 'GUARDIAN', 'SPONSOR');
  CREATE TYPE "public"."enum_promotion_batches_student_details_status" AS ENUM('PROMOTED', 'RETAINED', 'CONDITIONAL', 'GRADUATED', 'DISCONTINUED');
  CREATE TYPE "public"."enum_promotion_batches_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ROLLED_BACK');
  CREATE TYPE "public"."enum_promotion_batches_rules_promotion_criteria" AS ENUM('ACADEMIC', 'ATTENDANCE', 'BEHAVIORAL', 'COMBINED');
  CREATE TYPE "public"."enum_exams_term" AS ENUM('TERM_1', 'TERM_2', 'TERM_3');
  CREATE TYPE "public"."enum_exams_exam_type" AS ENUM('BEGINNING_OF_TERM', 'MIDTERM', 'MIDTERM_2', 'MIDTERM_3', 'END_TERM', 'CONTINUOUS_ASSESSMENT', 'PRACTICAL', 'PROJECT', 'OTHER');
  CREATE TYPE "public"."enum_exams_paper_type" AS ENUM('SINGLE', 'MULTIPLE');
  CREATE TYPE "public"."enum_exams_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');
  CREATE TYPE "public"."enum_exam_results_grade" AS ENUM('A', 'A_MINUS', 'B_PLUS', 'B', 'B_MINUS', 'C_PLUS', 'C', 'C_MINUS', 'D_PLUS', 'D', 'D_MINUS', 'E', 'F', 'EXCEEDING_EXPECTATIONS', 'MEETING_EXPECTATIONS', 'APPROACHING_EXPECTATIONS', 'BELOW_EXPECTATIONS', 'WELL_BELOW_EXPECTATIONS');
  CREATE TYPE "public"."enum_exam_results_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_tenants_roles" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_users_tenants_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"school_code" varchar,
  	"school_type" "enum_tenants_school_type",
  	"school_email" varchar,
  	"school_phone" varchar,
  	"school_address" varchar,
  	"county" varchar,
  	"sub_county" varchar,
  	"constituency" varchar,
  	"principal_name" varchar,
  	"principal_phone" varchar,
  	"principal_email" varchar,
  	"deputy_principal_name" varchar,
  	"deputy_principal_phone" varchar,
  	"deputy_principal_email" varchar,
  	"logo_id" integer,
  	"allow_public_read" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "academic_levels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"level_code" varchar,
  	"display_name" varchar NOT NULL,
  	"academic_system" "enum_academic_levels_academic_system" NOT NULL,
  	"level_order" numeric NOT NULL,
  	"description" varchar,
  	"age_range_min_age" numeric,
  	"age_range_max_age" numeric,
  	"subjects_required" numeric,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "class_streams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"stream_name" varchar NOT NULL,
  	"stream_code" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"remarks" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subjects_844_papers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paper_name" varchar,
  	"paper_code" varchar,
  	"max_marks" numeric,
  	"weight" numeric DEFAULT 1
  );
  
  CREATE TABLE "subjects_844_competencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"description" varchar,
  	"weight" numeric
  );
  
  CREATE TABLE "subjects_844" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"name" varchar NOT NULL,
  	"short_name" varchar,
  	"category" "enum_subjects_844_category" NOT NULL,
  	"description" varchar,
  	"is_compulsory" boolean DEFAULT false,
  	"max_score" numeric DEFAULT 100,
  	"pass_mark" numeric DEFAULT 40,
  	"paper_count" numeric DEFAULT 1,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subjects_cbc_learning_areas_competencies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"description" varchar,
  	"indicators" varchar
  );
  
  CREATE TABLE "subjects_cbc_learning_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar
  );
  
  CREATE TABLE "subjects_cbc" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"name" varchar NOT NULL,
  	"is_core" boolean DEFAULT true,
  	"strand" varchar,
  	"substrand" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "teachers_subjects844" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subject_id" integer
  );
  
  CREATE TABLE "teachers_subjects_c_b_c" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"subject_id" integer,
  	"strand" varchar,
  	"is_primary" boolean DEFAULT true
  );
  
  CREATE TABLE "teachers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"first_name" varchar NOT NULL,
  	"middle_name" varchar,
  	"last_name" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"employee_number" varchar,
  	"tsc_number" varchar,
  	"gender" "enum_teachers_gender" NOT NULL,
  	"date_of_birth" timestamp(3) with time zone,
  	"id_number" varchar,
  	"status" "enum_teachers_status" DEFAULT 'ACTIVE' NOT NULL,
  	"employment_type" "enum_teachers_employment_type" DEFAULT 'PERMANENT',
  	"qualifications" varchar,
  	"specialization" varchar,
  	"employment_date" timestamp(3) with time zone NOT NULL,
  	"department" varchar,
  	"photo_id" integer,
  	"bank_name" varchar,
  	"bank_account" varchar,
  	"bank_branch" varchar,
  	"nhif_number" varchar,
  	"nssf_number" varchar,
  	"kra_pin" varchar,
  	"address" varchar,
  	"remarks" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "classes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"academic_year" numeric NOT NULL,
  	"academic_level_id" integer NOT NULL,
  	"stream_id" integer,
  	"class_name" varchar NOT NULL,
  	"capacity" numeric DEFAULT 50,
  	"academic_system" "enum_classes_academic_system" DEFAULT 'EIGHT_FOUR_FOUR' NOT NULL,
  	"student_count" numeric DEFAULT 0,
  	"class_teacher_id" integer,
  	"is_active" boolean DEFAULT true,
  	"remarks" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "students_subjects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"is_compulsory" boolean DEFAULT true
  );
  
  CREATE TABLE "students" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"admission_number" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"first_name" varchar NOT NULL,
  	"middle_name" varchar,
  	"last_name" varchar NOT NULL,
  	"date_of_birth" timestamp(3) with time zone NOT NULL,
  	"gender" "enum_students_gender" NOT NULL,
  	"current_class_id" integer NOT NULL,
  	"current_stream_id" integer,
  	"current_level_id" integer NOT NULL,
  	"status" "enum_students_status" DEFAULT 'ACTIVE' NOT NULL,
  	"boarding_status" "enum_students_boarding_status" DEFAULT 'DAY_SCHOLAR',
  	"joining_date" timestamp(3) with time zone NOT NULL,
  	"admission_year" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "students_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"subjects_844_id" integer,
  	"subjects_cbc_id" integer
  );
  
  CREATE TABLE "parents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"parent_name" varchar NOT NULL,
  	"parent_phone" varchar NOT NULL,
  	"parent_email" varchar,
  	"parent_relationship" "enum_parents_parent_relationship" NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"address" varchar,
  	"remarks" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "parents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"students_id" integer
  );
  
  CREATE TABLE "promotion_batches_student_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from_academic_level_id" integer NOT NULL,
  	"to_academic_level_id" integer,
  	"status" "enum_promotion_batches_student_details_status"
  );
  
  CREATE TABLE "promotion_batches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"from_academic_year" numeric NOT NULL,
  	"to_academic_year" numeric NOT NULL,
  	"from_level_id" integer NOT NULL,
  	"to_level_id" integer NOT NULL,
  	"promotion_date" timestamp(3) with time zone NOT NULL,
  	"promoted_by_id" integer NOT NULL,
  	"total_students" numeric,
  	"promoted_count" numeric,
  	"retained_count" numeric,
  	"status" "enum_promotion_batches_status" DEFAULT 'PENDING',
  	"completed_at" timestamp(3) with time zone,
  	"rules_promotion_criteria" "enum_promotion_batches_rules_promotion_criteria" DEFAULT 'ACADEMIC',
  	"rules_min_attendance" numeric DEFAULT 75,
  	"rules_min_average_score" numeric DEFAULT 40,
  	"rules_max_failed_subjects" numeric DEFAULT 2,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exams_papers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paper_name" varchar,
  	"paper_code" varchar,
  	"max_marks" numeric,
  	"weight" numeric DEFAULT 1,
  	"description" varchar
  );
  
  CREATE TABLE "exams" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"exam_name" varchar NOT NULL,
  	"exam_code" varchar,
  	"academic_year" numeric NOT NULL,
  	"term" "enum_exams_term" NOT NULL,
  	"exam_type" "enum_exams_exam_type" NOT NULL,
  	"exam_date" timestamp(3) with time zone NOT NULL,
  	"due_date" timestamp(3) with time zone,
  	"class_id" integer NOT NULL,
  	"academic_level_id" integer,
  	"teacher_id" integer,
  	"max_score" numeric DEFAULT 100 NOT NULL,
  	"paper_type" "enum_exams_paper_type" DEFAULT 'SINGLE' NOT NULL,
  	"remarks" varchar,
  	"status" "enum_exams_status" DEFAULT 'DRAFT' NOT NULL,
  	"is_remarked" boolean DEFAULT false,
  	"remark_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exams_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"subjects_844_id" integer,
  	"subjects_cbc_id" integer
  );
  
  CREATE TABLE "exam_results_paper_scores" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"paper" varchar,
  	"paper_code" varchar,
  	"marks_obtained" numeric,
  	"max_marks" numeric,
  	"weight" numeric DEFAULT 1
  );
  
  CREATE TABLE "exam_results_attachments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "exam_results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"exam_id" integer NOT NULL,
  	"student_id" integer NOT NULL,
  	"class_id" integer,
  	"teacher_id" integer,
  	"total_marks" numeric NOT NULL,
  	"max_score" numeric NOT NULL,
  	"percentage" numeric,
  	"grade" "enum_exam_results_grade",
  	"grade_points" numeric,
  	"remarks" varchar,
  	"status" "enum_exam_results_status" DEFAULT 'DRAFT' NOT NULL,
  	"is_absent" boolean DEFAULT false,
  	"is_remarked" boolean DEFAULT false,
  	"remark_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exam_results_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"subjects_844_id" integer,
  	"subjects_cbc_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tenants_id" integer,
  	"academic_levels_id" integer,
  	"class_streams_id" integer,
  	"subjects_844_id" integer,
  	"subjects_cbc_id" integer,
  	"teachers_id" integer,
  	"classes_id" integer,
  	"students_id" integer,
  	"parents_id" integer,
  	"promotion_batches_id" integer,
  	"exams_id" integer,
  	"exam_results_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants_roles" ADD CONSTRAINT "users_tenants_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users_tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "class_streams" ADD CONSTRAINT "class_streams_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subjects_844_papers" ADD CONSTRAINT "subjects_844_papers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subjects_844_competencies" ADD CONSTRAINT "subjects_844_competencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subjects_cbc_learning_areas_competencies" ADD CONSTRAINT "subjects_cbc_learning_areas_competencies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subjects_cbc_learning_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subjects_cbc_learning_areas" ADD CONSTRAINT "subjects_cbc_learning_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_subjects844" ADD CONSTRAINT "teachers_subjects844_subject_id_subjects_844_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects_844"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teachers_subjects844" ADD CONSTRAINT "teachers_subjects844_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers_subjects_c_b_c" ADD CONSTRAINT "teachers_subjects_c_b_c_subject_id_subjects_cbc_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teachers_subjects_c_b_c" ADD CONSTRAINT "teachers_subjects_c_b_c_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "teachers" ADD CONSTRAINT "teachers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "teachers" ADD CONSTRAINT "teachers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "classes" ADD CONSTRAINT "classes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "classes" ADD CONSTRAINT "classes_stream_id_class_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."class_streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "classes" ADD CONSTRAINT "classes_class_teacher_id_teachers_id_fk" FOREIGN KEY ("class_teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students_subjects" ADD CONSTRAINT "students_subjects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_current_class_id_classes_id_fk" FOREIGN KEY ("current_class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_current_stream_id_class_streams_id_fk" FOREIGN KEY ("current_stream_id") REFERENCES "public"."class_streams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_current_level_id_academic_levels_id_fk" FOREIGN KEY ("current_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students" ADD CONSTRAINT "students_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_subjects_844_fk" FOREIGN KEY ("subjects_844_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_subjects_cbc_fk" FOREIGN KEY ("subjects_cbc_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parents" ADD CONSTRAINT "parents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "parents_rels" ADD CONSTRAINT "parents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parents_rels" ADD CONSTRAINT "parents_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotion_batches_student_details" ADD CONSTRAINT "promotion_batches_student_details_from_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("from_academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotion_batches_student_details" ADD CONSTRAINT "promotion_batches_student_details_to_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("to_academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotion_batches_student_details" ADD CONSTRAINT "promotion_batches_student_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."promotion_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_from_level_id_academic_levels_id_fk" FOREIGN KEY ("from_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_to_level_id_academic_levels_id_fk" FOREIGN KEY ("to_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_promoted_by_id_users_id_fk" FOREIGN KEY ("promoted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exams_papers" ADD CONSTRAINT "exams_papers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exams" ADD CONSTRAINT "exams_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exams" ADD CONSTRAINT "exams_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exams" ADD CONSTRAINT "exams_academic_level_id_academic_levels_id_fk" FOREIGN KEY ("academic_level_id") REFERENCES "public"."academic_levels"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exams" ADD CONSTRAINT "exams_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exams_rels" ADD CONSTRAINT "exams_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exams_rels" ADD CONSTRAINT "exams_rels_subjects_844_fk" FOREIGN KEY ("subjects_844_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exams_rels" ADD CONSTRAINT "exams_rels_subjects_cbc_fk" FOREIGN KEY ("subjects_cbc_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exam_results_paper_scores" ADD CONSTRAINT "exam_results_paper_scores_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exam_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exam_results_attachments" ADD CONSTRAINT "exam_results_attachments_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results_attachments" ADD CONSTRAINT "exam_results_attachments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exam_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exam_results_rels" ADD CONSTRAINT "exam_results_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exam_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exam_results_rels" ADD CONSTRAINT "exam_results_rels_subjects_844_fk" FOREIGN KEY ("subjects_844_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exam_results_rels" ADD CONSTRAINT "exam_results_rels_subjects_cbc_fk" FOREIGN KEY ("subjects_cbc_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_levels_fk" FOREIGN KEY ("academic_levels_id") REFERENCES "public"."academic_levels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_class_streams_fk" FOREIGN KEY ("class_streams_id") REFERENCES "public"."class_streams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subjects_844_fk" FOREIGN KEY ("subjects_844_id") REFERENCES "public"."subjects_844"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subjects_cbc_fk" FOREIGN KEY ("subjects_cbc_id") REFERENCES "public"."subjects_cbc"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_teachers_fk" FOREIGN KEY ("teachers_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_classes_fk" FOREIGN KEY ("classes_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_students_fk" FOREIGN KEY ("students_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parents_fk" FOREIGN KEY ("parents_id") REFERENCES "public"."parents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotion_batches_fk" FOREIGN KEY ("promotion_batches_id") REFERENCES "public"."promotion_batches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exams_fk" FOREIGN KEY ("exams_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exam_results_fk" FOREIGN KEY ("exam_results_id") REFERENCES "public"."exam_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_tenants_roles_order_idx" ON "users_tenants_roles" USING btree ("order");
  CREATE INDEX "users_tenants_roles_parent_idx" ON "users_tenants_roles" USING btree ("parent_id");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_logo_idx" ON "tenants" USING btree ("logo_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "academic_levels_updated_at_idx" ON "academic_levels" USING btree ("updated_at");
  CREATE INDEX "academic_levels_created_at_idx" ON "academic_levels" USING btree ("created_at");
  CREATE INDEX "class_streams_tenant_idx" ON "class_streams" USING btree ("tenant_id");
  CREATE INDEX "class_streams_updated_at_idx" ON "class_streams" USING btree ("updated_at");
  CREATE INDEX "class_streams_created_at_idx" ON "class_streams" USING btree ("created_at");
  CREATE INDEX "subjects_844_papers_order_idx" ON "subjects_844_papers" USING btree ("_order");
  CREATE INDEX "subjects_844_papers_parent_id_idx" ON "subjects_844_papers" USING btree ("_parent_id");
  CREATE INDEX "subjects_844_competencies_order_idx" ON "subjects_844_competencies" USING btree ("_order");
  CREATE INDEX "subjects_844_competencies_parent_id_idx" ON "subjects_844_competencies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "subjects_844_code_idx" ON "subjects_844" USING btree ("code");
  CREATE INDEX "subjects_844_updated_at_idx" ON "subjects_844" USING btree ("updated_at");
  CREATE INDEX "subjects_844_created_at_idx" ON "subjects_844" USING btree ("created_at");
  CREATE INDEX "subjects_cbc_learning_areas_competencies_order_idx" ON "subjects_cbc_learning_areas_competencies" USING btree ("_order");
  CREATE INDEX "subjects_cbc_learning_areas_competencies_parent_id_idx" ON "subjects_cbc_learning_areas_competencies" USING btree ("_parent_id");
  CREATE INDEX "subjects_cbc_learning_areas_order_idx" ON "subjects_cbc_learning_areas" USING btree ("_order");
  CREATE INDEX "subjects_cbc_learning_areas_parent_id_idx" ON "subjects_cbc_learning_areas" USING btree ("_parent_id");
  CREATE INDEX "subjects_cbc_updated_at_idx" ON "subjects_cbc" USING btree ("updated_at");
  CREATE INDEX "subjects_cbc_created_at_idx" ON "subjects_cbc" USING btree ("created_at");
  CREATE INDEX "teachers_subjects844_order_idx" ON "teachers_subjects844" USING btree ("_order");
  CREATE INDEX "teachers_subjects844_parent_id_idx" ON "teachers_subjects844" USING btree ("_parent_id");
  CREATE INDEX "teachers_subjects844_subject_idx" ON "teachers_subjects844" USING btree ("subject_id");
  CREATE INDEX "teachers_subjects_c_b_c_order_idx" ON "teachers_subjects_c_b_c" USING btree ("_order");
  CREATE INDEX "teachers_subjects_c_b_c_parent_id_idx" ON "teachers_subjects_c_b_c" USING btree ("_parent_id");
  CREATE INDEX "teachers_subjects_c_b_c_subject_idx" ON "teachers_subjects_c_b_c" USING btree ("subject_id");
  CREATE INDEX "teachers_tenant_idx" ON "teachers" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "teachers_email_idx" ON "teachers" USING btree ("email");
  CREATE UNIQUE INDEX "teachers_employee_number_idx" ON "teachers" USING btree ("employee_number");
  CREATE UNIQUE INDEX "teachers_tsc_number_idx" ON "teachers" USING btree ("tsc_number");
  CREATE UNIQUE INDEX "teachers_id_number_idx" ON "teachers" USING btree ("id_number");
  CREATE INDEX "teachers_photo_idx" ON "teachers" USING btree ("photo_id");
  CREATE INDEX "teachers_updated_at_idx" ON "teachers" USING btree ("updated_at");
  CREATE INDEX "teachers_created_at_idx" ON "teachers" USING btree ("created_at");
  CREATE INDEX "classes_tenant_idx" ON "classes" USING btree ("tenant_id");
  CREATE INDEX "classes_academic_level_idx" ON "classes" USING btree ("academic_level_id");
  CREATE INDEX "classes_stream_idx" ON "classes" USING btree ("stream_id");
  CREATE INDEX "classes_class_teacher_idx" ON "classes" USING btree ("class_teacher_id");
  CREATE INDEX "classes_updated_at_idx" ON "classes" USING btree ("updated_at");
  CREATE INDEX "classes_created_at_idx" ON "classes" USING btree ("created_at");
  CREATE INDEX "students_subjects_order_idx" ON "students_subjects" USING btree ("_order");
  CREATE INDEX "students_subjects_parent_id_idx" ON "students_subjects" USING btree ("_parent_id");
  CREATE INDEX "students_tenant_idx" ON "students" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "students_admission_number_idx" ON "students" USING btree ("admission_number");
  CREATE INDEX "students_current_class_idx" ON "students" USING btree ("current_class_id");
  CREATE INDEX "students_current_stream_idx" ON "students" USING btree ("current_stream_id");
  CREATE INDEX "students_current_level_idx" ON "students" USING btree ("current_level_id");
  CREATE INDEX "students_photo_idx" ON "students" USING btree ("photo_id");
  CREATE INDEX "students_updated_at_idx" ON "students" USING btree ("updated_at");
  CREATE INDEX "students_created_at_idx" ON "students" USING btree ("created_at");
  CREATE INDEX "students_rels_order_idx" ON "students_rels" USING btree ("order");
  CREATE INDEX "students_rels_parent_idx" ON "students_rels" USING btree ("parent_id");
  CREATE INDEX "students_rels_path_idx" ON "students_rels" USING btree ("path");
  CREATE INDEX "students_rels_subjects_844_id_idx" ON "students_rels" USING btree ("subjects_844_id");
  CREATE INDEX "students_rels_subjects_cbc_id_idx" ON "students_rels" USING btree ("subjects_cbc_id");
  CREATE INDEX "parents_tenant_idx" ON "parents" USING btree ("tenant_id");
  CREATE INDEX "parents_updated_at_idx" ON "parents" USING btree ("updated_at");
  CREATE INDEX "parents_created_at_idx" ON "parents" USING btree ("created_at");
  CREATE INDEX "parents_rels_order_idx" ON "parents_rels" USING btree ("order");
  CREATE INDEX "parents_rels_parent_idx" ON "parents_rels" USING btree ("parent_id");
  CREATE INDEX "parents_rels_path_idx" ON "parents_rels" USING btree ("path");
  CREATE INDEX "parents_rels_students_id_idx" ON "parents_rels" USING btree ("students_id");
  CREATE INDEX "promotion_batches_student_details_order_idx" ON "promotion_batches_student_details" USING btree ("_order");
  CREATE INDEX "promotion_batches_student_details_parent_id_idx" ON "promotion_batches_student_details" USING btree ("_parent_id");
  CREATE INDEX "promotion_batches_student_details_from_academic_level_idx" ON "promotion_batches_student_details" USING btree ("from_academic_level_id");
  CREATE INDEX "promotion_batches_student_details_to_academic_level_idx" ON "promotion_batches_student_details" USING btree ("to_academic_level_id");
  CREATE INDEX "promotion_batches_tenant_idx" ON "promotion_batches" USING btree ("tenant_id");
  CREATE INDEX "promotion_batches_from_level_idx" ON "promotion_batches" USING btree ("from_level_id");
  CREATE INDEX "promotion_batches_to_level_idx" ON "promotion_batches" USING btree ("to_level_id");
  CREATE INDEX "promotion_batches_promoted_by_idx" ON "promotion_batches" USING btree ("promoted_by_id");
  CREATE INDEX "promotion_batches_updated_at_idx" ON "promotion_batches" USING btree ("updated_at");
  CREATE INDEX "promotion_batches_created_at_idx" ON "promotion_batches" USING btree ("created_at");
  CREATE INDEX "exams_papers_order_idx" ON "exams_papers" USING btree ("_order");
  CREATE INDEX "exams_papers_parent_id_idx" ON "exams_papers" USING btree ("_parent_id");
  CREATE INDEX "exams_tenant_idx" ON "exams" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "exams_exam_code_idx" ON "exams" USING btree ("exam_code");
  CREATE INDEX "exams_class_idx" ON "exams" USING btree ("class_id");
  CREATE INDEX "exams_academic_level_idx" ON "exams" USING btree ("academic_level_id");
  CREATE INDEX "exams_teacher_idx" ON "exams" USING btree ("teacher_id");
  CREATE INDEX "exams_updated_at_idx" ON "exams" USING btree ("updated_at");
  CREATE INDEX "exams_created_at_idx" ON "exams" USING btree ("created_at");
  CREATE INDEX "exams_rels_order_idx" ON "exams_rels" USING btree ("order");
  CREATE INDEX "exams_rels_parent_idx" ON "exams_rels" USING btree ("parent_id");
  CREATE INDEX "exams_rels_path_idx" ON "exams_rels" USING btree ("path");
  CREATE INDEX "exams_rels_subjects_844_id_idx" ON "exams_rels" USING btree ("subjects_844_id");
  CREATE INDEX "exams_rels_subjects_cbc_id_idx" ON "exams_rels" USING btree ("subjects_cbc_id");
  CREATE INDEX "exam_results_paper_scores_order_idx" ON "exam_results_paper_scores" USING btree ("_order");
  CREATE INDEX "exam_results_paper_scores_parent_id_idx" ON "exam_results_paper_scores" USING btree ("_parent_id");
  CREATE INDEX "exam_results_attachments_order_idx" ON "exam_results_attachments" USING btree ("_order");
  CREATE INDEX "exam_results_attachments_parent_id_idx" ON "exam_results_attachments" USING btree ("_parent_id");
  CREATE INDEX "exam_results_attachments_file_idx" ON "exam_results_attachments" USING btree ("file_id");
  CREATE INDEX "exam_results_tenant_idx" ON "exam_results" USING btree ("tenant_id");
  CREATE INDEX "exam_results_exam_idx" ON "exam_results" USING btree ("exam_id");
  CREATE INDEX "exam_results_student_idx" ON "exam_results" USING btree ("student_id");
  CREATE INDEX "exam_results_class_idx" ON "exam_results" USING btree ("class_id");
  CREATE INDEX "exam_results_teacher_idx" ON "exam_results" USING btree ("teacher_id");
  CREATE INDEX "exam_results_updated_at_idx" ON "exam_results" USING btree ("updated_at");
  CREATE INDEX "exam_results_created_at_idx" ON "exam_results" USING btree ("created_at");
  CREATE INDEX "exam_results_rels_order_idx" ON "exam_results_rels" USING btree ("order");
  CREATE INDEX "exam_results_rels_parent_idx" ON "exam_results_rels" USING btree ("parent_id");
  CREATE INDEX "exam_results_rels_path_idx" ON "exam_results_rels" USING btree ("path");
  CREATE INDEX "exam_results_rels_subjects_844_id_idx" ON "exam_results_rels" USING btree ("subjects_844_id");
  CREATE INDEX "exam_results_rels_subjects_cbc_id_idx" ON "exam_results_rels" USING btree ("subjects_cbc_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_academic_levels_id_idx" ON "payload_locked_documents_rels" USING btree ("academic_levels_id");
  CREATE INDEX "payload_locked_documents_rels_class_streams_id_idx" ON "payload_locked_documents_rels" USING btree ("class_streams_id");
  CREATE INDEX "payload_locked_documents_rels_subjects_844_id_idx" ON "payload_locked_documents_rels" USING btree ("subjects_844_id");
  CREATE INDEX "payload_locked_documents_rels_subjects_cbc_id_idx" ON "payload_locked_documents_rels" USING btree ("subjects_cbc_id");
  CREATE INDEX "payload_locked_documents_rels_teachers_id_idx" ON "payload_locked_documents_rels" USING btree ("teachers_id");
  CREATE INDEX "payload_locked_documents_rels_classes_id_idx" ON "payload_locked_documents_rels" USING btree ("classes_id");
  CREATE INDEX "payload_locked_documents_rels_students_id_idx" ON "payload_locked_documents_rels" USING btree ("students_id");
  CREATE INDEX "payload_locked_documents_rels_parents_id_idx" ON "payload_locked_documents_rels" USING btree ("parents_id");
  CREATE INDEX "payload_locked_documents_rels_promotion_batches_id_idx" ON "payload_locked_documents_rels" USING btree ("promotion_batches_id");
  CREATE INDEX "payload_locked_documents_rels_exams_id_idx" ON "payload_locked_documents_rels" USING btree ("exams_id");
  CREATE INDEX "payload_locked_documents_rels_exam_results_id_idx" ON "payload_locked_documents_rels" USING btree ("exam_results_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_tenants_roles" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "academic_levels" CASCADE;
  DROP TABLE "class_streams" CASCADE;
  DROP TABLE "subjects_844_papers" CASCADE;
  DROP TABLE "subjects_844_competencies" CASCADE;
  DROP TABLE "subjects_844" CASCADE;
  DROP TABLE "subjects_cbc_learning_areas_competencies" CASCADE;
  DROP TABLE "subjects_cbc_learning_areas" CASCADE;
  DROP TABLE "subjects_cbc" CASCADE;
  DROP TABLE "teachers_subjects844" CASCADE;
  DROP TABLE "teachers_subjects_c_b_c" CASCADE;
  DROP TABLE "teachers" CASCADE;
  DROP TABLE "classes" CASCADE;
  DROP TABLE "students_subjects" CASCADE;
  DROP TABLE "students" CASCADE;
  DROP TABLE "students_rels" CASCADE;
  DROP TABLE "parents" CASCADE;
  DROP TABLE "parents_rels" CASCADE;
  DROP TABLE "promotion_batches_student_details" CASCADE;
  DROP TABLE "promotion_batches" CASCADE;
  DROP TABLE "exams_papers" CASCADE;
  DROP TABLE "exams" CASCADE;
  DROP TABLE "exams_rels" CASCADE;
  DROP TABLE "exam_results_paper_scores" CASCADE;
  DROP TABLE "exam_results_attachments" CASCADE;
  DROP TABLE "exam_results" CASCADE;
  DROP TABLE "exam_results_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_tenants_roles";
  DROP TYPE "public"."enum_tenants_school_type";
  DROP TYPE "public"."enum_academic_levels_academic_system";
  DROP TYPE "public"."enum_subjects_844_category";
  DROP TYPE "public"."enum_teachers_gender";
  DROP TYPE "public"."enum_teachers_status";
  DROP TYPE "public"."enum_teachers_employment_type";
  DROP TYPE "public"."enum_classes_academic_system";
  DROP TYPE "public"."enum_students_gender";
  DROP TYPE "public"."enum_students_status";
  DROP TYPE "public"."enum_students_boarding_status";
  DROP TYPE "public"."enum_parents_parent_relationship";
  DROP TYPE "public"."enum_promotion_batches_student_details_status";
  DROP TYPE "public"."enum_promotion_batches_status";
  DROP TYPE "public"."enum_promotion_batches_rules_promotion_criteria";
  DROP TYPE "public"."enum_exams_term";
  DROP TYPE "public"."enum_exams_exam_type";
  DROP TYPE "public"."enum_exams_paper_type";
  DROP TYPE "public"."enum_exams_status";
  DROP TYPE "public"."enum_exam_results_grade";
  DROP TYPE "public"."enum_exam_results_status";`)
}
