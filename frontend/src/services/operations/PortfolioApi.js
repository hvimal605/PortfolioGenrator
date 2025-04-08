import toast from "react-hot-toast";
import { messgaeEndPoints, portfolioEndpoints, projectEndpoints, skillEndpoints, SoftwareAppEndpoints, TimelineEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
  Create_Timeline
} = TimelineEndpoints

const {
  Add_Skill
} = skillEndpoints

const {
  GET_PORTFOLIO_FULL_DETAILS_BYID,
  CREATE_PORTFOLIO,
  DEPLOY_PORTFOLIO,
  GET_PORTFOIOS_FOR_USER,
  GET_Portfolio_VisitorStats,
  GET_ADMIN_DASHBOARD_STATS,
  GET_USER_OR_PORTFOLIO_CREATION_DATA_MONTLY
} = portfolioEndpoints

const {
  ADD_PROJECT
} = projectEndpoints

const { GET_ALL_MESSAGES , DELETE_MESSAGE ,TOGGLE_EMAIL_NOTIFICATION} = messgaeEndPoints


const { ADD_SOFTWARE_APPLICATION } = SoftwareAppEndpoints


export const createTimeline = async (timelineData, token) => {
  const toastId = toast.loading("Adding Timeline...");

  // console.log("yeha sb dekhte h",timelineData,token)

  try {

    const response = await apiConnector("POST", Create_Timeline, timelineData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("Timeline API Response:", response);

    // Correctly handling the response structure
    if (!response?.data?.success) {
      throw new Error("Could not add timeline.");
    }
    toast.success("Timeline added!")


  } catch (error) {
    console.error("CREATE_TIMELINE_API ERROR:", error);
    toast.error(error.message || "Something went wrong while adding the timeline");
  }

  toast.dismiss(toastId);

};


export const addSkill = async (skillData, token) => {
  const toastId = toast.loading("Adding Skill...");
  console.log("dekhte to kiya arah hai bhai ", skillData, token)

  try {
    const response = await apiConnector("POST", Add_Skill, skillData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Add Skill API Response:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add skill.");
    }

    toast.success("Skill added successfully!");
  } catch (error) {
    console.error("ADD_SKILL_API ERROR:", error);
    toast.error(error.message || "Something went wrong while adding the skill");
  }

  toast.dismiss(toastId);
};

export const addSoftwareApplication = async (softwareData, token) => {
  const toastId = toast.loading("Adding Software Application...");
  // console.log("dekhte to kiya arah hai bhai ", softwareData, token)

  try {
    const response = await apiConnector("POST", ADD_SOFTWARE_APPLICATION, softwareData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Add Software app API Response:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add Software app.");
    }

    toast.success("Software application  added successfully!");
  } catch (error) {
    console.error("ADD_SOFTWARE_APP_API ERROR:", error);
    toast.error(error.message || "Something went wrong while adding the Software app");
  }

  toast.dismiss(toastId);
};

export const addProject = async (projectData, token) => {
  const toastId = toast.loading("Adding Project ...");

  try {
    const response = await apiConnector("POST", ADD_PROJECT, projectData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Add PROJECT API Response:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add Project.");
    }

    toast.success("Project added successfully!");
  } catch (error) {
    console.error("ADD_PROJECT_API ERROR:", error);
    toast.error(error.message || "Something went wrong while adding the Project");
  }

  toast.dismiss(toastId);
};

export const addPersonalDetails = async (personalData, token) => {
  let result = null
  const toastId = toast.loading("Adding Personal Deatails ...");

  try {
    const response = await apiConnector("POST", CREATE_PORTFOLIO, personalData, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("Add PERSONAL DETAILS API Response:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not add Personal details.");
    }

    toast.success("Personal details added successfully!");
    result = response?.data?.portfolio

  } catch (error) {
    console.error("PERSONAL_DETAILS_API ERROR:", error);
    toast.error(error.message || "Something went wrong while adding the Personal details");
  }

  toast.dismiss(toastId);
  return result
};



export const getFullDetailsOfPortfolio = async (portfolioId, token) => {
  const toastId = toast.loading("Loading...")

  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_PORTFOLIO_FULL_DETAILS_BYID,
      {
        portfolioId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("PORTFOLIO_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("PORTFOLIO_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
  }
  toast.dismiss(toastId)
  return result
}


export const deployPortfolio = async (portfolioData, token) => {
  let result = null
  const toastId = toast.loading("Deploying Portfolio...");


  try {
    const response = await apiConnector("POST", DEPLOY_PORTFOLIO, portfolioData, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log("Deploy Portfolio API Response:", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Portfolio deployment failed.");
    }

    toast.success("Portfolio deployed successfully!");
    result = response?.data;
  } catch (error) {
    console.error("DEPLOY_PORTFOLIO_API ERROR:", error);
    toast.error(error.message || "Something went wrong while deploying the portfolio.");
  }
  toast.dismiss(toastId);
  return result
};


export const getPortfoliosForUser = async (token) => {
  const toastId = toast.loading("Loading...")

  let result = null
  try {
    const response = await apiConnector("GET", GET_PORTFOIOS_FOR_USER, null,

      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("PORTFOLIOS_FOR_USER_API RESPONSE............", response.data)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data
  } catch (error) {
    console.log("PORTFOLIOS_FOR_USER_API  ERROR............", error)
    result = error.response.data
  }
  toast.dismiss(toastId)
  return result
}

export const getPortfolioVisitorStats = async (portfolioId, token) => {
  const toastId = toast.loading("Loading...");

  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_Portfolio_VisitorStats,
      { portfolioId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("GET_Portfolio_VisitorStats_API RESPONSE............", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response?.data;
  } catch (error) {
    console.log("GET_Portfolio_VisitorStats_API ERROR............", error);
    result = error?.response?.data || { success: false, message: "Something went wrong!" };
  }

  toast.dismiss(toastId);
  return result;
};


export const getAllMessages = async (portfolioId, token) => {
  const toastId = toast.loading("Loading...");

  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_ALL_MESSAGES,
      { portfolioId },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );

    console.log(" GET_ALL_MESSAGES_API RESPONSE............", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    result = response?.data;
  } catch (error) {
    console.log(" GET_ALL_MESSAGES_API ERROR............", error);
    result = error?.response?.data || { success: false, message: "Something went wrong!" };
  }

  toast.dismiss(toastId);
  return result;
};


export const deleteMessage = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_MESSAGE, data, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })
    console.log(" DELETE_MESSAGE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Message")
    }
    toast.success("Message Deleted")
    result = response.data;
  } catch (error) {
    console.log("DELETE Message API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



export const updateEmailNotificationStatus = async (portfolioId, token) => {
  let result = null;
  const toastId = toast.loading("Updating preferences...");

  try {
    const response = await apiConnector("POST", TOGGLE_EMAIL_NOTIFICATION, {portfolioId}, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log("TOGGLE_EMAIL_NOTIFICATION API RESPONSE: ", response);

    if (!response?.data?.success) {
      throw new Error("Failed to update email notification status");
    }

    toast.success(response.data.message || "Updated successfully");
    result = response.data;
  } catch (error) {
    console.error("TOGGLE_EMAIL_NOTIFICATION ERROR: ", error);
    toast.error(error.message || "Something went wrong");
  }

  toast.dismiss(toastId);
  return result;
};


export const getAdminDashboardStats = async (token) => {
  const toastId = toast.loading("Fetching dashboard stats...")

  let result = null
  try {
    const response = await apiConnector(
      "GET",
      GET_ADMIN_DASHBOARD_STATS,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("GET_ADMIN_DASHBOARD_STATS RESPONSE:", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    result = response?.data?.data
  } catch (error) {
    console.log("GET_ADMIN_DASHBOARD_STATS ERROR:", error)
    result = error?.response?.data
    toast.error(error?.response?.data?.message || "Failed to fetch dashboard stats")
  }

  toast.dismiss(toastId)
  return result
}


export const getMonthlyUserDeveloperPortfolioStats = async (token) => {
  try {
    const res = await apiConnector("GET", GET_USER_OR_PORTFOLIO_CREATION_DATA_MONTLY, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!res?.data?.success) throw new Error("Failed to fetch monthly stats");
    return res.data.data; // array of { month, users, developers, portfolios }
  } catch (err) {
    console.error("MONTHLY_STATS_ERROR:", err);
    return [];
  }
};
